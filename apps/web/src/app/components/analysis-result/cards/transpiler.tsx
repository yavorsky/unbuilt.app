import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { transpiler as transpilerFeature } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { FileCode2 } from 'lucide-react';

const supportedOptions = Object.keys(transpilerFeature.patterns).map(
  capitalize
);

export const TranspilerCard: FC<{
  transpiler: AnalyzeResult['analysis']['transpiler'] | undefined;
}> = ({ transpiler }) => {
  return (
    <SingleResultAnalysisCard
      name="transpiler"
      supportedOptions={supportedOptions}
      Icon={FileCode2}
      analysis={transpiler}
      meta={transpilerFeature?.meta}
    />
  );
};
