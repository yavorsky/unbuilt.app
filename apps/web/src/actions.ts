'use server';

import { revalidatePath } from 'next/cache';
import { QueueManager } from './lib/QueueManager';
import { AnalysisManager } from './lib/AnalysisManager';
import { OnProgressResult } from '@unbuilt/analyzer';

type AnalyzeState = { error: string | null; analysisId?: string };

export async function analyzeWebsite(
  prevState: AnalyzeState,
  formData: FormData
): Promise<AnalyzeState> {
  try {
    let url = formData.get('url');

    if (!url || typeof url !== 'string') {
      return { error: 'URL is required' };
    }

    if (!url.startsWith('https://')) {
      url = `https://${url}`;
    }

    let id: string;
    const manager = AnalysisManager.getInstance();

    // We are displaying latest analysis for this url by default
    const analysisId = await manager.getAnalysisIdByUrl(url);
    console.log(analysisId, url, 'analysisId');
    if (analysisId) {
      id = analysisId;
    } else {
      id = await manager.startAnalysis(url);
    }

    revalidatePath('/analyzis/[id]', 'page');
    return { error: null, analysisId: id };
  } catch (error) {
    console.error('Analysis failed:', error);
    return { error: 'Failed to analyze website' };
  }
}

export async function getJobStatus(analysisId: string) {
  try {
    const queueManager = QueueManager.getInstance();
    await queueManager.initialize();

    const job = await queueManager.getJob(analysisId);

    if (!job) {
      throw new Error('Job not found');
    }

    const state = await job.getState();
    // If job is completed, return the result, otherwise return the onprogress data
    // Not using job.returnvalue b/c it's untyped
    const result = job.data;

    return {
      id: job.id,
      status: state,
      result,
      progress: job.progress() as number,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      error: null,
    };
  } catch (error) {
    console.error('Status check failed:', error);
    return {
      id: analysisId,
      status: 'failed',
      result: null,
      progress: 0,
      processedOn: new Date().getTime(),
      timestamp: Date.now(),
      finishedOn: null,
      error: (error as Error)?.message,
    };
  }
}

export type AnalysisResults = {
  id: string;
  status: string;
  result: OnProgressResult | null;
  progress: number;
  timestamp: number;
  processedOn: number;
  finishedOn: number | null;
  error: string | null;
};

export async function getAnalysisResults(id: string): Promise<AnalysisResults> {
  try {
    const manager = AnalysisManager.getInstance();
    return await manager.getAnalysisResults(id);
  } catch (error) {
    return {
      id,
      status: 'failed',
      result: null,
      progress: 0,
      timestamp: 0,
      processedOn: 0,
      finishedOn: null,
      error: (error as Error).name,
    };
  }
}
