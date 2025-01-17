import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { stateManagementMeta } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { LucideStore } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(stateManagementMeta.meta);

export const StateManagementCard: FC<{
  stateManagement: AnalyzeResult['analysis']['stateManagement'] | undefined;
}> = ({ stateManagement }) => {
  return (
    <SingleResultAnalysisCard
      name="stateManagement"
      supportedOptions={supportedOptions}
      analysis={stateManagement}
      Icon={LucideStore}
      meta={stateManagementMeta.meta}
    />
  );
};
