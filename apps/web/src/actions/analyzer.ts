import { QueueManager } from '../server/queue-manager';
import { AnalysisManager } from '../server/analysis-manager';
import { AnalysisResults } from '.';
import { normalizeUrl } from '@unbuilt/helpers';

export type AnalyzeState = { error: string | null; analysisId?: string };

export async function startAnalysis(
  url: string,
  lookupForExisting: boolean = false
): Promise<AnalyzeState> {
  try {
    if (!url) {
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

    return { error: null, analysisId };
  } catch (error) {
    console.error('Analysis failed:', error);
    return { error: 'Failed to analyze website' };
  }
}

export async function getStatus(analysisId: string) {
  try {
    const queueManager = QueueManager.getInstance();
    await queueManager.initialize();

    const job = await queueManager.getJob(analysisId);

    if (!job) {
      throw new Error('Job not found');
    }

    const state = await job.getState();
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

export async function getAnalysis(id: string): Promise<AnalysisResults> {
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
