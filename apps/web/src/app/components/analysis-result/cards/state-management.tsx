import { FC } from 'react';
import {
  AnalysisKeys,
  AnalyzeResult,
  stateManagementPatterns,
} from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { LucideStore } from 'lucide-react';

const supportedOptions = Object.keys(stateManagementPatterns).map(capitalize);

export const StateManagementCard: FC<{
  stateManagement: AnalyzeResult['analysis']['stateManagement'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ stateManagement, onCardSelect }) => {
  return (
    <SingleResultAnalysisCard
      name="stateManagement"
      supportedOptions={supportedOptions}
      analysis={stateManagement}
      Icon={LucideStore}
      onCardSelect={onCardSelect}
    />
  );
};
