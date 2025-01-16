import QueueService, { Queue, Job } from 'bull';
import {
  AnalyzeResult,
  OnProgressResult,
  analyze,
  errors,
} from '@unbuilt/analyzer';
import os from 'os';
import { BrowserManager } from './browser-manager';
import { OnProgress } from '../../../../packages/analyzer/build/progress';
import { BrowserContext } from 'playwright';

// Using 75% since ~25% is used for system tasks. We can adjust this in the future. Value should be not higher than 6, to not overload network.
const CONCURRENT_JOBS = Math.min(
  Math.max(1, Math.floor(os.cpus().length * 0.75)),
  3
);
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 5000; // 5 seconds
const ANALYSIS_TIMEOUT = 30000; // 30 seconds

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
        },
        limiter: {
          max: CONCURRENT_JOBS, // Match with number of browser instances
          duration: 1000 * CONCURRENT_JOBS, // Per 1 second.
          bounceBack: true, // Queue up if limit is hit
        },
      });

      // Initialize browser manager
      this.browserManager = new BrowserManager();
      await this.browserManager.initialize(CONCURRENT_JOBS);

      // Process jobs
      this.queue.process(CONCURRENT_JOBS, async (job) => {
        let context: BrowserContext | undefined;
        console.log(`[Job ${job.id}] Starting processing for ${job.data.url}`);

        try {
          context = await this.browserManager?.getBrowserContext();
          if (!context) throw new Error('Browser context not available');
          const browser = context.browser();
          if (!browser) throw new Error('Browser not available');

          const page = await context.newPage();
          page.setDefaultNavigationTimeout(30000);

          const onProgress: OnProgress = (partialResult, progress) => {
            job.update(partialResult);
            job.progress(progress);
          };

          const result = await analyze(job.data.url, page, browser, onProgress);
          console.log(`[Job ${job.id}] Completed analysis for ${job.data.url}`);
          return result;
        } catch (error) {
          const e = error as Error;
          if (e.message === errors.RESOURCE_NOT_AVAILABLE) {
            // Expected error, so no need to retry
            job.discard();
            console.log('resource is not available');
          } else {
            console.error(`[Job ${job.id}] Failed:`, error);
          }
          throw error;
        } finally {
          if (context) {
            await context
              .close()
              .catch((err) =>
                console.error(`[Job ${job.id}] Error closing context:`, err)
              );
          }
        }
      });

      // // Set up event handlers
      this.queue.on('completed', async (job) => {
        console.log(job.id, 'COMPLETED');
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
      console.log(
        `[QueueManager] Active jobs count changed: ${this.lastActiveCount} → ${currentActiveCount}`
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
