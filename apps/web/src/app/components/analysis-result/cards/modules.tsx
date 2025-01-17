import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Combine } from 'lucide-react';

export const ModulesCard: FC<{
  modules: AnalyzeResult['analysis']['modules'] | undefined;
}> = ({ modules }) => {
  return (
    <SingleResultAnalysisCard
      name="modules"
      analysis={modules}
      Icon={Combine}
    />
  );
};
