import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { stylingProcessorMeta } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Paintbrush2 } from 'lucide-react';

const supportedOptions = Object.keys(
  stylingProcessorMeta.meta
) as (keyof typeof stylingProcessorMeta.meta)[];

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
        ...stylingProcessorMeta.meta,
      }}
    />
  );
};
