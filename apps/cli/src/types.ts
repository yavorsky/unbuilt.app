import { AnalyzeResult } from '@unbuilt/analyzer';

export interface AnalysisStatusResponse {
  id: string;
  status: string;
  result: AnalyzeResult | null;
  progress: number;
  timestamp: number;
  processedOn: number;
  finishedOn: number | null;
  error: string | null;
}
