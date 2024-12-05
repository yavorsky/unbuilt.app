import { FC } from 'react';
import { Minimize2 } from 'lucide-react';
import {
  AnalysisKeys,
  AnalyzeResult,
  minifierPatterns,
} from '@unbuilt/analyzer';
import { AnalysisCard } from './single-result-card';
import { capitalize } from 'lodash-es';

const supportedOptions = Object.keys(minifierPatterns).map(capitalize);

export const MinifierCard: FC<{
  minifier: AnalyzeResult['analysis']['minifier'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ minifier, onCardSelect }) => {
  return (
    <AnalysisCard
      name="minifier"
      analysis={minifier}
      Icon={Minimize2}
      onCardSelect={onCardSelect}
      supportedOptions={supportedOptions}
    />
  );
};

export default MinifierCard;
