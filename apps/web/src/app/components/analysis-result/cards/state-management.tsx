import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { stateManagement as stateManagementFeature } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { LucideStore } from 'lucide-react';

const supportedOptions = Object.keys(stateManagementFeature.patterns).map(
  capitalize
);

export const StateManagementCard: FC<{
  stateManagement: AnalyzeResult['analysis']['stateManagement'] | undefined;
}> = ({ stateManagement }) => {
  return (
    <SingleResultAnalysisCard
      name="stateManagement"
      supportedOptions={supportedOptions}
      analysis={stateManagement}
      Icon={LucideStore}
      meta={stateManagementFeature?.meta}
    />
  );
};
