import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Network } from 'lucide-react';
import { httpClient as httpClientFeature } from '@unbuilt/features';

const supportedOptions = Object.keys(httpClientFeature.patterns).map(
  capitalize
);

export const HTTPClientCard: FC<{
  httpClient: AnalyzeResult['analysis']['httpClient'] | undefined;
}> = ({ httpClient }) => {
  return (
    <SingleResultAnalysisCard
      name="httpClient"
      supportedOptions={supportedOptions}
      analysis={httpClient}
      Icon={Network}
      meta={httpClientFeature?.meta}
    />
  );
};
