import { FC } from 'react';
import { AnalysisKeys, AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { FileCode2 } from 'lucide-react';
import { transpiler } from '@unbuilt/features';

const supportedOptions = Object.keys(transpiler.patterns).map(capitalize);

export const TranspilerCard: FC<{
  transpiler: AnalyzeResult['analysis']['transpiler'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ transpiler, onCardSelect }) => {
  return (
    <SingleResultAnalysisCard
      name="transpiler"
      supportedOptions={supportedOptions}
      Icon={FileCode2}
      analysis={transpiler}
      onCardSelect={onCardSelect}
    />
  );
};
