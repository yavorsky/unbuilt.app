import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Server } from 'lucide-react';

export const HostingCard: FC<{
  hosting: AnalyzeResult['analysis']['hosting'] | undefined;
}> = ({ hosting }) => {
  return (
    <SingleResultAnalysisCard
      name="hosting"
      analysis={hosting}
      Icon={Server}
      withSecondaryMatches={false}
    />
  );
};
