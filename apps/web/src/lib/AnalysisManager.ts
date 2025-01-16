import { AnalyzeResult, OnProgressResult } from '@unbuilt/analyzer';
import { QueueManager } from './QueueManager';
import { saveAnalysis, getAnalysisById, getAnalyzysMetaByUrl } from './api';
import { v4 as uuidv4 } from 'uuid';
import Bull from 'bull';

export interface AnalysisStatus {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  result: AnalyzeResult | null;
  progress?: number;
  error?: string | null;
}

export class AnalysisManager {
  private static instance: AnalysisManager;
  private queueManager: QueueManager;

  private constructor() {
    this.queueManager = QueueManager.getInstance();
  }

  public static getInstance(): AnalysisManager {
    if (!AnalysisManager.instance) {
      AnalysisManager.instance = new AnalysisManager();
    }
    return AnalysisManager.instance;
  }

  private async onJobCompleted(jobId: string, result: AnalyzeResult) {
    console.log('Job is completed', jobId);
    await this.storeResult(jobId, result);
    await this.queueManager.removeJob(jobId);
  }

  async startAnalysis(url: string): Promise<string> {
    const id = uuidv4();

    await this.queueManager.initialize();
    await this.queueManager.addJob(url, { jobId: id });
    const handleJobCompleted = (
      job: Bull.Job<OnProgressResult>,
      result: AnalyzeResult
    ) => {
      if (id === job.id) {
        this.onJobCompleted(job.id as string, result);
        this.queueManager.queue?.off('completed', handleJobCompleted);
      }
    };
    this.queueManager.queue?.on('completed', handleJobCompleted);

    return id;
  }

  async getAnalysisResults(id: string) {
    // Check Redis first
    const ongoingAnalysis = await this.getOngoingAnalysis(id);

    if (ongoingAnalysis) {
      return ongoingAnalysis;
    }

    const completedAnalysis = await this.getCompletedAnalysis(id);

    if (completedAnalysis) {
      return completedAnalysis;
    }

    throw new Error('Analysis not found');
  }

  private async getOngoingAnalysis(id: string) {
    await this.queueManager.initialize();
    const job = await this.queueManager.getJob(id);

    // First, check redis ongoing jobs. We don't want to save ongoring progress in Supabase. Only finished ones
    if (job) {
      const state = await job.getState();
      const result = job.data;
      const error = job.failedReason ?? null;

      return {
        id: job.id as string,
        status: state,
        result,
        progress: job.progress() as number,
        timestamp: job.timestamp ?? 0,
        processedOn: job.processedOn ?? 0,
        finishedOn: job.finishedOn ?? 0,
        error,
      };
    }
    return null;
  }

  private async getCompletedAnalysis(id: string) {
    // If not in Redis, check Supabase
    const { data: analysis, error } = await getAnalysisById(id);

    // TODO: Handle error
    if (error || !analysis) {
      return null;
    }

    const timestamp = analysis?.timestamp ? +analysis?.timestamp : 0;
    return {
      id,
      status: 'completed',
      result: analysis as OnProgressResult,
      progress: 100,
      timestamp: timestamp,
      processedOn: timestamp,
      finishedOn: timestamp || null,
      error: null,
    };
  }

  async getAnalyzysMetaByUrl(url: string) {
    try {
      const { data } = await getAnalyzysMetaByUrl(url);
      return { id: data?.id, analyzedAt: data?.analyzed_at };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private async storeResult(id: string, result: AnalyzeResult) {
    await saveAnalysis(id, result);
  }
}
