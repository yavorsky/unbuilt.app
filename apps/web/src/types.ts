import { AnalysisKeys } from '@unbuilt/analyzer';

export interface TechCount {
  name: string;
  count: number;
}

export type TechnologyStats = Omit<Record<AnalysisKeys, TechCount[]>, 'stats'>;
