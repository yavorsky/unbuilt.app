import { FC } from 'react';
import { Minimize2 } from 'lucide-react';
import {
  AnalysisKeys,
  AnalyzeResult,
  minifierPatterns,
} from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';

const supportedOptions = Object.keys(minifierPatterns).map(capitalize);

export const MinifierCard: FC<{
  minifier: AnalyzeResult['analysis']['minifier'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ minifier, onCardSelect }) => {
  return (
    <SingleResultAnalysisCard
      name="minifier"
      analysis={minifier}
      Icon={Minimize2}
      onCardSelect={onCardSelect}
      supportedOptions={supportedOptions}
    />
  );
};
