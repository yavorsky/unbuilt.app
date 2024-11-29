'use server';

import { revalidatePath } from 'next/cache';
import { QueueManager } from './lib/QueueManager';
import { JobId } from 'bull';
import { AnalysisManager, AnalysisStatus } from './lib/AnalysisManager';

type AnalyzeState = { error: string | null, jobId?: JobId };

export async function analyzeWebsite(
  prevState: AnalyzeState,
  formData: FormData
): Promise<AnalyzeState> {
  try {
    const url = formData.get('url');

    if (!url || typeof url !== 'string') {
      return { error: 'URL is required' };
    }

    const manager = AnalysisManager.getInstance();
    const id = await manager.startAnalysis(url);

    revalidatePath('/results');
    return { error: null, jobId: id };
  } catch (error) {
    console.error('Analysis failed:', error);
    return { error: 'Failed to analyze website' };
  }
}

export async function getJobStatus(jobId: string) {
  try {
    const queueManager = QueueManager.getInstance();
    await queueManager.initialize();

    const job = await queueManager.getJob(jobId);

    if (!job) {
      return {
        error: 'Job not found'
      };
    }

    const state = await job.getState();
    const result = job.returnvalue;

    return {
      id: job.id,
      status: state,
      result: result || null,
      progress: job.progress(),
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn
    };
  } catch (error) {
    console.error('Status check failed:', error);
    return {
      error: 'Failed to get job status'
    };
  }
}

{

}

export async function getAnalysisResults(id: string): Promise<AnalysisStatus> {
  try {
    const manager = AnalysisManager.getInstance();
    return await manager.getAnalysisResults(id);
  } catch (error) {
    console.error('Status check failed:', error);
    return {
      id,
      status: 'failed',
      result: null,
      error: 'Failed to get analysis status'
    };
  }
}