import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { LucideStore } from 'lucide-react';
import { stateManagement } from '@unbuilt/features';

const supportedOptions = Object.keys(stateManagement.patterns).map(capitalize);

export const StateManagementCard: FC<{
  stateManagement: AnalyzeResult['analysis']['stateManagement'] | undefined;
}> = ({ stateManagement }) => {
  return (
    <SingleResultAnalysisCard
      name="stateManagement"
      supportedOptions={supportedOptions}
      analysis={stateManagement}
      Icon={LucideStore}
    />
  );
};
