import QueueService, { Queue, Job, QueueOptions } from 'bull';
import {
  AnalyzeResult,
  OnProgress,
  OnProgressResult,
  analyze,
  errors,
} from '@unbuilt/analyzer';
import { BrowserContext } from 'playwright';
import { BrowserManager } from '@unbuilt/helpers';
import { setUserHeaders } from './utils/set-user-headers';
import { trackError } from '@/app/utils/error-monitoring';
import logger from '@/app/utils/logger/logger';

// Using 75% since ~25% is used for system tasks. We can adjust this in the future. Value should be not higher than 6, to not overload network.
const CONCURRENT_JOBS = 1; //Math.max(1, Math.floor(os.cpus().length * 0.75));
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 5000; // 5 seconds
export const ANALYSIS_TIMEOUT = 70000; // 70 seconds
const STALL_CHECK_INTERVAL = 30 * 1000; // Check for stalled jobs every 30 seconds

export class QueueManager {
  private static instance: QueueManager;
  queue: Queue<OnProgressResult> | null = null;
  private browserManager: BrowserManager | null = null;
  private initializing: Promise<void> | null = null;
  private lastActiveCount: number = 0;

  private constructor() {}

  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  async initialize() {
    // Prevent multiple simultaneous initializations
    if (this.initializing) return this.initializing;
    if (this.queue) return;

    this.initializing = (async () => {
      // Initialize queue
      this.queue = new QueueService<AnalyzeResult>('website-analysis', {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        },
        defaultJobOptions: {
          removeOnComplete: 300,
          removeOnFail: 300,
          attempts: MAX_RETRY_ATTEMPTS,
          backoff: {
            type: 'exponential',
            delay: RETRY_DELAY,
          },
          timeout: ANALYSIS_TIMEOUT,
          stallInterval: STALL_CHECK_INTERVAL, // Check for stalled jobs
          maxStalledCount: 2, // Number of times a job can be marked as stalled before being moved to failed
        },
        limiter: {
          max: CONCURRENT_JOBS, // Match with number of browser instances
          duration: 1000 * CONCURRENT_JOBS, // Per 1 second.
          bounceBack: true, // Queue up if limit is hit
        },
        settings: {
          lockDuration: ANALYSIS_TIMEOUT,
          stallInterval: STALL_CHECK_INTERVAL, // Check for stalled jobs (in ms)
          maxStalledCount: 2,
        },
      } as QueueOptions);

      // Initialize browser manager
      this.browserManager = new BrowserManager();
      await this.browserManager.initialize(CONCURRENT_JOBS, trackError);

      // Process jobs
      this.queue.process(CONCURRENT_JOBS, async (job) => {
        let context: BrowserContext | undefined;
        logger.info(`Starting analysis`, { id: job.id, url: job.data.url });

        // Here we are covering case, when job was timed out and moved to stalled.
        // After that, when queue is ready it becomes available. But in this case, we have some chance of the job
        // to be completed, since the promise was resolved after bull moved it to stalled.
        // Since we can't just cancel the job from second execution (due to lack of bull API), we want to have early return.
        if (job.progress() === 100) return job.data;

        try {
          const contextInfo = await this.browserManager?.getBrowserContext();
          context = contextInfo?.context;
          if (!context) throw new Error('Browser context not available');
          const browser = context.browser();
          if (!browser) throw new Error('Browser not available');

          const page = await context.newPage();
          await setUserHeaders(page);

          const onProgress: OnProgress = async (partialResult, progress) => {
            await job.update(partialResult);
            await job.progress(progress);
          };

          const onError = (error: Error) => {
            trackError(error, { url: job.data.url, id: job.id });
          };

          const result = await analyze(
            job.data.url,
            job.id as string,
            page,
            browser,
            onProgress,
            onError
          );
          logger.info(`Completed analysis`, {
            id: job.id,
            url: job.data.url,
            result,
          });
          if (await job.isDelayed()) {
            try {
              await job.update(result);
              await job.progress(100);
            } catch (updateError) {
              trackError(updateError as Error, {
                url: job.data.url,
                id: job.id,
              });
            }
          }
          try {
            await context.close();
          } catch (closeError) {
            trackError(closeError as Error, { url: job.data.url, id: job.id });
          }
          return result;
        } catch (error) {
          const e = error as Error;
          if (e.message === errors.RESOURCE_NOT_AVAILABLE) {
            // Expected error, so no need to retry
            job.discard();
            logger.info('Resource is not available', {
              url: job.data.url,
              id: job.id,
            });
          } else {
            trackError(error as Error, { url: job.data.url, id: job.id });
          }
          throw error;
        } finally {
          if (context) {
            await context
              .close()
              .catch((err) =>
                trackError(err as Error, { url: job.data.url, id: job.id })
              );
          }
        }
      });

      // // Set up event handlers
      this.queue.on('completed', async () => {
        await this.checkAndLogActiveJobs();
      });

      this.queue.on('failed', async () => {
        await this.checkAndLogActiveJobs();
      });

      // Optional: Add more event handlers
      this.queue.on('error', async () => {
        await this.checkAndLogActiveJobs();
      });

      this.queue.on('stalled', async () => {
        await this.checkAndLogActiveJobs();
      });
    })();

    await this.initializing;
    this.initializing = null;
  }

  async addJob(url: string, opts: { jobId: string }) {
    if (!this.queue) {
      throw new Error('Queue not initialized');
    }
    return this.queue.add(
      {
        url,
        id: opts.jobId,
        timestamp: new Date().toISOString(),
        duration: 0,
        analysis: {},
      },
      opts
    );
  }

  async removeJob(jobId: string) {
    const job = await this.getJob(jobId);
    return job?.remove();
  }

  async getJob(jobId: string) {
    if (!this.queue) {
      throw new Error('Queue not initialized');
    }
    return this.queue.getJob(jobId);
  }

  async cleanup() {
    if (this.browserManager) {
      await this.browserManager.cleanup();
    }
    if (this.queue) {
      await this.queue.close();
    }
  }

  // Helper methods
  async getQueueMetrics() {
    if (!this.queue) {
      throw new Error('Queue not initialized');
    }

    const [waiting, active, completed, failed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      timestamp: new Date().toISOString(),
    };
  }

  async updateJobProgress(job: Job, progress: number) {
    await job.progress(progress);
  }

  private async checkAndLogActiveJobs() {
    if (!this.queue) return;

    const currentActiveCount = await this.queue.getActiveCount();
    if (currentActiveCount !== this.lastActiveCount) {
      logger.info(
        `Active jobs count changed: ${this.lastActiveCount} → ${currentActiveCount}`,
        { count: currentActiveCount }
      );
      this.lastActiveCount = currentActiveCount;
    }
  }
}

// Optional: Add types for better TypeScript support
export interface AnalysisJob {
  url: string;
  timestamp: string;
}

export interface JobStatus {
  id: string;
  status: string;
  result: AnalyzeResult | null;
  progress: number;
  timestamp: Date;
  processedOn?: Date;
  finishedOn?: Date;
  error?: string;
}
