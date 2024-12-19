import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { modules } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Combine } from 'lucide-react';

const supportedOptions = Object.keys(modules.patterns).map(capitalize);

export const ModulesCard: FC<{
  modules: AnalyzeResult['analysis']['modules'] | undefined;
}> = ({ modules }) => {
  return (
    <SingleResultAnalysisCard
      name="modules"
      analysis={modules}
      Icon={Combine}
      supportedOptions={supportedOptions}
    />
  );
};
