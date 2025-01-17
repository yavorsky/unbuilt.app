import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { transpilerMeta } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { FileCode2 } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(transpilerMeta.meta);

export const TranspilerCard: FC<{
  transpiler: AnalyzeResult['analysis']['transpiler'] | undefined;
}> = ({ transpiler }) => {
  return (
    <SingleResultAnalysisCard
      name="transpiler"
      supportedOptions={supportedOptions}
      analysis={transpiler}
      meta={transpilerMeta.meta}
      Icon={FileCode2}
    />
  );
};
