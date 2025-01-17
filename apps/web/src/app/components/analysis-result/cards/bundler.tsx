import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Box } from 'lucide-react';

export const BundlerCard: FC<{
  bundler: AnalyzeResult['analysis']['bundler'] | undefined;
}> = ({ bundler }) => {
  return (
    <SingleResultAnalysisCard name="bundler" analysis={bundler} Icon={Box} />
  );
};
