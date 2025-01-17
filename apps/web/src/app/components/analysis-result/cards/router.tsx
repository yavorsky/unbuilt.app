import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Calendar } from 'lucide-react';

export const RouterCard: FC<{
  router: AnalyzeResult['analysis']['router'] | undefined;
}> = ({ router }) => {
  return (
    <SingleResultAnalysisCard name="router" analysis={router} Icon={Calendar} />
  );
};
