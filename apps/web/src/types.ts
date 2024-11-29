import { AnalysisResult } from '@unbuilt/analyzer';

// types.ts
export interface JobResult {
  id: string;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result: AnalysisResult | null;
  created_at: Date;
  updated_at: Date;
}
