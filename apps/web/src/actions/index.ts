'use server';

import { revalidatePath } from 'next/cache';
import { AnalysisManager } from '../server/analysis-manager';
import {
  AnalysisTechnologies,
  AnalyzeResult,
  OnProgressResult,
} from '@unbuilt/analyzer';
import { normalizeUrl } from '../app/utils/normalize-url';
import { getTechnologyStatsQuery } from '../server/api/get-all-technology-stats';
import {
  getTechnologyTrendsQuery,
  TimeRange,
} from '../server/api/get-technology-trends';
import { getTechnologyWebsitesQuery } from '../server/api/get-technology-websites';
import { getAnalysis, getStatus, startAnalysis } from './analyzer';

type AnalyzeState = { error: string | null; analysisId?: string };

export async function analyzeWebsite(
  formData: FormData,
  lookupForExisting: boolean = false
): Promise<AnalyzeState> {
  const url = formData.get('url');
  if (!url || typeof url !== 'string') {
    return { error: 'URL is required' };
  }
  const result = await startAnalysis(url, lookupForExisting);
  if (result.analysisId) {
    revalidatePath('/analyzis/[id]', 'page');
  }
  return result;
}

export async function getJobStatus(analysisId: string) {
  return getStatus(analysisId);
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
    return await getAnalysis(id);
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

export async function getTechnologyStats(type: AnalysisTechnologies) {
  return getTechnologyStatsQuery(type);
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
