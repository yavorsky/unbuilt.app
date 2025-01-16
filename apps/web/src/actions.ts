'use server';

import { revalidatePath } from 'next/cache';
import { QueueManager } from './server/queue-manager';
import { AnalysisManager } from './server/analysis-manager';
import {
  AnalysisTechnologies,
  AnalyzeResult,
  OnProgressResult,
} from '@unbuilt/analyzer';
import { normalizeUrl } from './app/utils/normalize-url';
import { getTechnologyStatsQuery } from './server/api/get-all-technology-stats';
import {
  getTechnologyTrendsQuery,
  TimeRange,
} from './server/api/get-technology-trends';
import { getTechnologyWebsitesQuery } from './server/api/get-technology-websites';

type AnalyzeState = { error: string | null; analysisId?: string };

export async function analyzeWebsite(
  formData: FormData,
  lookupForExisting: boolean = false
): Promise<AnalyzeState> {
  try {
    let url = formData.get('url');

    if (!url || typeof url !== 'string') {
      return { error: 'URL is required' };
    }

    const normalizedUrl = normalizeUrl(url);
    const manager = AnalysisManager.getInstance();
    let existingId: string | null = null;
    if (lookupForExisting) {
      const analysisMeta = await manager.getAnalyzysMetaByUrl(normalizedUrl);
      if (analysisMeta?.id) {
        existingId = analysisMeta?.id;
      }
    }
    const analysisId =
      existingId ?? (await manager.startAnalysis(normalizedUrl));

    revalidatePath('/analyzis/[id]', 'page');
    return { error: null, analysisId };
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

export const getAnalysisMetaByUrl = async (url: string) => {
  const manager = AnalysisManager.getInstance();
  // We are displaying latest analysis for this url by default
  const analysisMeta = await manager.getAnalyzysMetaByUrl(normalizeUrl(url));
  return analysisMeta;
};

export async function getTechnologyStats() {
  return getTechnologyStatsQuery();
}

export async function getTechnologyTrends(
  type: AnalysisTechnologies,
  timeRange?: TimeRange
) {
  return getTechnologyTrendsQuery(type, timeRange);
}

export async function getTechnologyWebsites<T extends AnalysisTechnologies>({
  type,
  technology,
  page = 1,
  search = '',
  pageSize = 20,
}: {
  type: T;
  technology: keyof AnalyzeResult['analysis'][T];
  page?: number;
  search?: string;
  pageSize?: number;
}) {
  return getTechnologyWebsitesQuery({
    type,
    technology,
    page,
    search,
    pageSize,
  });
}
