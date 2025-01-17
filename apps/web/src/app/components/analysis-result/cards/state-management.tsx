import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { LucideStore } from 'lucide-react';

export const StateManagementCard: FC<{
  stateManagement: AnalyzeResult['analysis']['stateManagement'] | undefined;
}> = ({ stateManagement }) => {
  return (
    <SingleResultAnalysisCard
      name="stateManagement"
      analysis={stateManagement}
      Icon={LucideStore}
    />
  );
};
