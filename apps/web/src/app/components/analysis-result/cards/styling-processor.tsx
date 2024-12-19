import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Paintbrush2 } from 'lucide-react';
import { stylingProcessor } from '@unbuilt/features';

const supportedOptions = Object.keys(stylingProcessor.cssInJsPatterns)
  .concat(Object.keys(stylingProcessor.preprocessorPatterns))
  .map(capitalize);

export const StylingProcessorCard: FC<{
  stylingProcessor: AnalyzeResult['analysis']['stylingProcessor'] | undefined;
}> = ({ stylingProcessor }) => {
  return (
    <SingleResultAnalysisCard
      name="stylingProcessor"
      analysis={stylingProcessor}
      supportedOptions={supportedOptions}
      Icon={Paintbrush2}
    />
  );
};
