import { AnalysisResult } from '@unbuilt/analyzer';
import { QueueManager } from './QueueManager';
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export interface AnalysisStatus {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  result: AnalysisResult | null;
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

  async onJobCompleted(jobId: string, result: AnalysisResult) {
    this.storeResult(jobId, result);
  }

  async startAnalysis(url: string): Promise<string> {
    const id = uuidv4();


    await this.queueManager.initialize({ onJobCompleted: this.onJobCompleted });
    await this.queueManager.addJob(url, { jobId: id });

    // Enable if we want to store initial state in Supabase in the future
    // const { error } = await supabase
    //   .from('analysis_results')
    //   .insert({
    //     id,
    //     url,
    //     status: 'processing',
    //     result: null,
    //   });

    // if (error) {
    //   await job.remove();
    //   throw new Error(`Failed to create analysis: ${error.message}`);
    // }

    return id;
  }

  async getAnalysisResults(id: string): Promise<AnalysisStatus> {
    // Check Redis first
    await this.queueManager.initialize();
    const job = await this.queueManager.getJob(id);

    if (job) {
      const state = await job.getState();
      const result = job.returnvalue;

      if (state === 'completed' && result) {
        return {
          id,
          status: 'completed',
          result,
          progress: 100
        };
      }

      if (state === 'failed') {
        return {
          id,
          status: 'failed',
          result: null,
          error: 'Job processing failed'
        };
      }

      return {
        id,
        status: 'processing',
        result: null,
        progress: job.progress()
      };
    }

    // If not in Redis, check Supabase
    const { data: analysis, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return {
        id,
        status: 'failed',
        result: null,
        error: 'Analysis not found'
      };
    }

    return {
      id,
      status: analysis.status,
      result: analysis.result,
      progress: analysis.status === 'completed' ? 100 : undefined
    };
  }

  private async storeResult(id: string, result: any) {
    await supabase
      .from('analysis_results')
      .update({
        status: 'completed',
        result,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
  }
}
