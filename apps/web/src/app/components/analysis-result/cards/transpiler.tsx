import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { FileCode2 } from 'lucide-react';

export const TranspilerCard: FC<{
  transpiler: AnalyzeResult['analysis']['transpiler'] | undefined;
}> = ({ transpiler }) => {
  return (
    <SingleResultAnalysisCard
      name="transpiler"
      analysis={transpiler}
      Icon={FileCode2}
      withSecondaryMatches={false}
    />
  );
};
