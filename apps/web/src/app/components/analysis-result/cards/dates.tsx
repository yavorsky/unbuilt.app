import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Calendar } from 'lucide-react';

export const DatesCard: FC<{
  dates: AnalyzeResult['analysis']['dates'] | undefined;
}> = ({ dates }) => {
  return (
    <SingleResultAnalysisCard name="dates" analysis={dates} Icon={Calendar} />
  );
};
