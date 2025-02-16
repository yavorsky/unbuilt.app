import { AnalyzeResult } from './analyze.js';
import { OnProgressResult } from './types.js';

export type OnProgress = (
  partialResult: OnProgressResult,
  progress: number
) => void;

export const createProgressTracker = ({
  url,
  id,
  onProgress,
  startedAt,
  totalResults,
}: {
  url: string;
  id: string;
  onProgress?: OnProgress;
  startedAt: Date;
  totalResults: number;
}) => {
  let results = 0;
  let calculatedResults: Partial<AnalyzeResult['analysis']> = {};

  return (partialResult: Partial<AnalyzeResult['analysis']>) => {
    results += 1;
    calculatedResults = {
      ...calculatedResults,
      ...partialResult,
    };
    const finishedAt = new Date();
    const duration = finishedAt.getTime() - startedAt.getTime();

    const stageResult = {
      url,
      id,
      timestamp: finishedAt.toISOString(),
      duration,
      analysis: calculatedResults,
    };
    onProgress?.(stageResult, (results / totalResults) * 100);
    return stageResult;
  };
};
export type OnProgressTracked = ReturnType<typeof createProgressTracker>;
