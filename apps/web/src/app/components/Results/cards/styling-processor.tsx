import { FC } from 'react';
import {
  AnalysisKeys,
  AnalyzeResult,
  cssInJsPatterns,
  preprocessorPatterns,
} from '@unbuilt/analyzer';
import { AnalysisCard } from './single-result-card';
import { capitalize } from 'lodash-es';
import { Paintbrush2 } from 'lucide-react';

const supportedOptions = Object.keys(cssInJsPatterns)
  .concat(Object.keys(preprocessorPatterns))
  .map(capitalize);

export const StylingProcessorCard: FC<{
  stylingProcessor: AnalyzeResult['analysis']['stylingProcessor'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ stylingProcessor, onCardSelect }) => {
  return (
    <AnalysisCard
      name="stylingProcessor"
      analysis={stylingProcessor}
      supportedOptions={supportedOptions}
      Icon={Paintbrush2}
      onCardSelect={onCardSelect}
    />
  );
};
