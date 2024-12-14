import { FC } from 'react';
import {
  AnalysisKeys,
  AnalyzeResult,
  httpClientPatterns,
} from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Network } from 'lucide-react';

const supportedOptions = Object.keys(httpClientPatterns).map(capitalize);

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
