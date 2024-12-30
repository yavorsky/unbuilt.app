import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Paintbrush2 } from 'lucide-react';
import { stylingProcessor as stylingProcessorFeature } from '@unbuilt/features';

const supportedOptions = Object.keys(
  stylingProcessorFeature.cssInJsMeta
).concat(Object.keys(stylingProcessorFeature.preprocessorMeta));

export const StylingProcessorCard: FC<{
  stylingProcessor: AnalyzeResult['analysis']['stylingProcessor'] | undefined;
}> = ({ stylingProcessor }) => {
  return (
    <SingleResultAnalysisCard
      name="stylingProcessor"
      analysis={stylingProcessor}
      supportedOptions={supportedOptions}
      Icon={Paintbrush2}
      meta={{
        ...stylingProcessorFeature.cssInJsMeta,
        ...stylingProcessorFeature.preprocessorMeta,
      }}
    />
  );
};
