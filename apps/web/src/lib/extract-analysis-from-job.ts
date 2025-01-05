/**
 * Extract analysis data from Bull job result
 */

import { AnalyzeResult } from '@unbuilt/analyzer';

export function extractAnalysisFromJob(result: AnalyzeResult) {
  // Get the actual analysis data either from returnvalue (completed job) or data (job in progress)
  const analysisData = jobResult.returnvalue || jobResult.data;

  return {
    id: jobResult.opts?.jobId || jobResult.id,
    url: analysisData.url,
    timestamp: analysisData.timestamp,
    duration: analysisData.duration,
    analysis: analysisData.analysis,
  };
}
