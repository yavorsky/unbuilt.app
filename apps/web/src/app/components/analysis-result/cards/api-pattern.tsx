import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Network } from 'lucide-react';

export const ApiPatternCard: FC<{
  apiPattern: AnalyzeResult['analysis']['apiPattern'] | undefined;
}> = ({ apiPattern }) => {
  return (
    <SingleResultAnalysisCard
      name="apiPattern"
      analysis={apiPattern}
      Icon={Network}
      withSecondaryMatches={false}
    />
  );
};
