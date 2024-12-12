import { FC } from 'react';
import {
  AnalysisKeys,
  AnalyzeResult,
  bundlerPatterns,
} from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Box } from 'lucide-react';

const supportedOptions = Object.keys(bundlerPatterns).map(capitalize);

export const BundlerCard: FC<{
  bundler: AnalyzeResult['analysis']['bundler'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ bundler, onCardSelect }) => {
  return (
    <SingleResultAnalysisCard
      name="bundler"
      supportedOptions={supportedOptions}
      analysis={bundler}
      Icon={Box}
      onCardSelect={onCardSelect}
    />
  );
};
