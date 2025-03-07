import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Boxes } from 'lucide-react';

export const FrameworkCard: FC<{
  framework: AnalyzeResult['analysis']['framework'] | undefined;
}> = ({ framework }) => {
  return (
    <SingleResultAnalysisCard
      name="framework"
      analysis={framework}
      Icon={Boxes}
      withSecondaryMatches={false}
    />
  );
};
