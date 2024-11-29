// lib/queueManager.ts
import QueueService, { Queue, Job } from 'bull';
import { BrowserManager } from './BrowserManager';
import { AnalysisResult, Analyzer } from '@unbuilt/analyzer';
import os from 'os';

// Using 75% since ~25% is used for system tasks. We can adjust this in the future.
const CONCURRENT_JOBS = Math.max(1, Math.floor(os.cpus().length * 0.75));

type OnJobCompleted = (jobId: string, result: AnalysisResult) => void;

export class QueueManager {
  private static instance: QueueManager;
  private queue: Queue | null = null;
  private browserManager: BrowserManager | null = null;
  private initializing: Promise<void> | null = null;
  private onJobCompleted: OnJobCompleted | null = null;

  private constructor() {}

  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  async initialize({ onJobCompleted }: { onJobCompleted?: OnJobCompleted } = {}) {
    // Prevent multiple simultaneous initializations
    if (this.initializing) return this.initializing;
    if (this.queue) return;

    this.onJobCompleted = onJobCompleted ?? null;

    this.initializing = (async () => {
      // Initialize queue
      this.queue = new QueueService('website-analysis', {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
        defaultJobOptions: {
          removeOnComplete: 100,  // Keep last 100 completed jobs
          removeOnFail: 100      // Keep last 100 failed jobs
        }
      });

      // Initialize browser manager
      this.browserManager = new BrowserManager();
      await this.browserManager.initialize(CONCURRENT_JOBS);
      const browser = this.browserManager.getBrowser();

      // Process jobs
      this.queue.process(CONCURRENT_JOBS, async (job) => {
        const context = await this.browserManager?.getContext();
        if (!context) throw new Error('Browser context not available');
        if (!browser) throw new Error('No browser available');

        const page = await context.newPage();
        try {
          const analyzer = new Analyzer(page, browser);
          await analyzer.initialize()
          const result = await analyzer.analyze(job.data.url);
          return result;
        } catch (e) {
          console.error('Analysis failed:', e);
          throw e;
        } finally {
          await page.close();
        }
      });

      // Set up event handlers
      this.queue.on('completed', (job, result) => {
        console.log(`Job ${job.id} completed:`, result);
        // Consider moving to process callback and not store any result in redis
        this.onJobCompleted?.(job.id.toString(), result);
      });

      this.queue.on('failed', (job, error) => {
        console.error(`Job ${job.id} failed:`, error);
      });

      // Optional: Add more event handlers
      this.queue.on('error', (error) => {
        console.error('Queue error:', error);
      });

      this.queue.on('stalled', (job) => {
        console.warn(`Job ${job.id} has stalled`);
      });
    })();

    await this.initializing;
    this.initializing = null;
  }

  async addJob(url: string, opts: { jobId: string }) {
    if (!this.queue) {
      throw new Error('Queue not initialized');
    }
    return this.queue.add({
      url,
      timestamp: new Date().toISOString()
    }, opts);
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
      timestamp: new Date().toISOString()
    };
  }

  async updateJobProgress(job: Job, progress: number) {
    await job.progress(progress);
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
  result: any | null;
  progress: number;
  timestamp: Date;
  processedOn?: Date;
  finishedOn?: Date;
  error?: string;
}
