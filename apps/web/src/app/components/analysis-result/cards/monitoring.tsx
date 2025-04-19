import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { CloudAlert } from 'lucide-react';

export const MonitoringCard: FC<{
  monitoring: AnalyzeResult['analysis']['monitoring'] | undefined;
}> = ({ monitoring }) => {
  return (
    <SingleResultAnalysisCard
      name="monitoring"
      analysis={monitoring}
      Icon={CloudAlert}
    />
  );
};
