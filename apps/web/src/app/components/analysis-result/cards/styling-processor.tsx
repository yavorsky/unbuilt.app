import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Paintbrush2 } from 'lucide-react';

export const StylingProcessorCard: FC<{
  stylingProcessor: AnalyzeResult['analysis']['stylingProcessor'] | undefined;
}> = ({ stylingProcessor }) => {
  return (
    <SingleResultAnalysisCard
      name="stylingProcessor"
      analysis={stylingProcessor}
      Icon={Paintbrush2}
    />
  );
};
