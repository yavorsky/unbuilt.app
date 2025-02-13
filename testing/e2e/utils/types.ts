import { OnProgressResult } from '@unbuilt/analyzer';

export interface TestProjectConfig {
  dependencies: Record<string, string>;
  files: Record<string, string>;
  buildCommand?: string;
  env?: Record<string, string>;
  outDir: string;
}

export type ConfidenceCheck =
  | number
  | { greaterThan: number }
  | { lessThan: number }
  | { between: [number, number] };

export interface ExpectedResult {
  libraries: Record<
    string,
    {
      name: string;
      confidence: ConfidenceCheck;
      secondaryMatches?: Record<
        string,
        {
          name: string;
          confidence: ConfidenceCheck;
        }
      >;
    }
  >;
}

export interface FrameworkConfig {
  buildCommand: string;
  outputDir: string;
  serverCommand?: string;
  env?: Record<string, string>;
}

export interface AnalyzerResponse {
  error: string | null;
  analysisId?: string;
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
