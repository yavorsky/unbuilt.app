import { FC } from 'react';
import { AnalysisKeys, AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Network } from 'lucide-react';
import { httpClient } from '@unbuilt/features';

const supportedOptions = Object.keys(httpClient.patterns).map(capitalize);

export const HTTPClientCard: FC<{
  httpClient: AnalyzeResult['analysis']['httpClient'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ httpClient, onCardSelect }) => {
  return (
    <SingleResultAnalysisCard
      name="httpClient"
      supportedOptions={supportedOptions}
      analysis={httpClient}
      Icon={Network}
      onCardSelect={onCardSelect}
    />
  );
};
