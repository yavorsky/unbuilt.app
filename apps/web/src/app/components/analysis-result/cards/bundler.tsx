import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { bundlerMeta } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Box } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(bundlerMeta.meta);

export const BundlerCard: FC<{
  bundler: AnalyzeResult['analysis']['bundler'] | undefined;
}> = ({ bundler }) => {
  return (
    <SingleResultAnalysisCard
      name="bundler"
      supportedOptions={supportedOptions}
      analysis={bundler}
      Icon={Box}
      meta={bundlerMeta?.meta}
    />
  );
};
