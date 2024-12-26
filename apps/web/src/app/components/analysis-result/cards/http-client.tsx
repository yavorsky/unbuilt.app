import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { httpClient as httpClientFeature } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Network } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(httpClientFeature.meta);

export const HTTPClientCard: FC<{
  httpClient: AnalyzeResult['analysis']['httpClient'] | undefined;
}> = ({ httpClient }) => {
  return (
    <SingleResultAnalysisCard
      name="httpClient"
      supportedOptions={supportedOptions}
      analysis={httpClient}
      Icon={Network}
      meta={httpClientFeature.meta}
    />
  );
};
