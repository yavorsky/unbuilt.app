import { AnalysisFeatures, Stats } from '@unbuilt/features';

export type Pattern = {
  runtime?: RegExp[];
  filenames?: RegExp[];
  browser?: () => boolean | Promise<boolean>;
  score: number;
  name: string;
};

export type OnProgressResult = {
  [K in keyof AnalyzeResult]: K extends 'analysis'
    ? Partial<AnalyzeResult[K]>
    : AnalyzeResult[K];
};

export type AnalysisKeys = keyof OnProgressResult['analysis'];
export type AnalysisTechnologies = Exclude<
  AnalysisKeys,
  'stylingLibraries' | 'stats'
>;
export type AnalysisMultiTechnologies = Extract<
  AnalysisKeys,
  'stylingLibraries'
>;

export type OnProgress = (
  partialResult: OnProgressResult,
  progress: number
) => void;

export type AnalysisFeaturesWithStats = AnalysisFeatures & { stats: Stats };
export type AnalyzeResult = {
  url: string;
  id: string;
  timestamp: string;
  duration: number;
  analysis: AnalysisFeaturesWithStats;
};
