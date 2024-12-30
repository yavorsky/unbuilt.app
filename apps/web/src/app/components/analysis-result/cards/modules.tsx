import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { modules as modulesFeature } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Combine } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(modulesFeature.meta);

export const ModulesCard: FC<{
  modules: AnalyzeResult['analysis']['modules'] | undefined;
}> = ({ modules }) => {
  return (
    <SingleResultAnalysisCard
      name="modules"
      analysis={modules}
      Icon={Combine}
      supportedOptions={supportedOptions}
      meta={modulesFeature.meta}
    />
  );
};
