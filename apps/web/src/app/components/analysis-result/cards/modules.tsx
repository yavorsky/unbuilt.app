import { FC } from 'react';
import { AnalysisKeys, AnalyzeResult, modulePatterns } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Combine } from 'lucide-react';

const supportedOptions = Object.keys(modulePatterns).map(capitalize);

export const ModulesCard: FC<{
  modules: AnalyzeResult['analysis']['modules'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ modules, onCardSelect }) => {
  return (
    <SingleResultAnalysisCard
      name="modules"
      analysis={modules}
      Icon={Combine}
      onCardSelect={onCardSelect}
      supportedOptions={supportedOptions}
    />
  );
};
