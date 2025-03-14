import {
  AnalysisFeaturesWithStats,
  AnalyzeResult,
  OnProgress,
} from '../types.js';

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
  let calculatedResults: Partial<AnalysisFeaturesWithStats> = {};

  return (partialResult: Partial<AnalysisFeaturesWithStats>) => {
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

export type OnProgressHandler = (
  partialResult: Partial<AnalyzeResult['analysis']>
) => {
  url: string;
  id: string;
  timestamp: string;
  duration: number;
  analysis: Partial<AnalyzeResult['analysis']>;
};
export type OnProgressTracked = ReturnType<typeof createProgressTracker>;
