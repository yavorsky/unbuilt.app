import { AnalyzeResult } from './analyze.js';

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
