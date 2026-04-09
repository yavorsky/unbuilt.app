import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Wand2 } from 'lucide-react';

export const AnimationCard: FC<{
  animation: AnalyzeResult['analysis']['animation'] | undefined;
}> = ({ animation }) => {
  return (
    <SingleResultAnalysisCard
      name="animation"
      analysis={animation}
      Icon={Wand2}
      withSecondaryMatches={false}
    />
  );
};
