import { FC } from 'react';
import {
  AnalysisKeys,
  AnalyzeResult,
  transpilerPatterns,
} from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { FileCode2 } from 'lucide-react';

const supportedOptions = Object.keys(transpilerPatterns).map(capitalize);

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

export default TranspilerCard;
