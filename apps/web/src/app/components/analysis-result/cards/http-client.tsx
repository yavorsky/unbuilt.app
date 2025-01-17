import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Network } from 'lucide-react';

export const HTTPClientCard: FC<{
  httpClient: AnalyzeResult['analysis']['httpClient'] | undefined;
}> = ({ httpClient }) => {
  return (
    <SingleResultAnalysisCard
      name="httpClient"
      analysis={httpClient}
      Icon={Network}
    />
  );
};
