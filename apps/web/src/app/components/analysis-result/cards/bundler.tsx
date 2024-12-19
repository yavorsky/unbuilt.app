import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { bundler as bundlerFeature } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Box } from 'lucide-react';

const supportedOptions = Object.keys(bundlerFeature.patterns).map(capitalize);

export const BundlerCard: FC<{
  bundler: AnalyzeResult['analysis']['bundler'] | undefined;
}> = ({ bundler }) => {
  return (
    <SingleResultAnalysisCard
      name="bundler"
      supportedOptions={supportedOptions}
      analysis={bundler}
      Icon={Box}
      meta={bundlerFeature?.meta}
    />
  );
};
