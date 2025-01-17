import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { httpClientMeta } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Network } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(httpClientMeta.meta);

export const HTTPClientCard: FC<{
  httpClient: AnalyzeResult['analysis']['httpClient'] | undefined;
}> = ({ httpClient }) => {
  return (
    <SingleResultAnalysisCard
      name="httpClient"
      supportedOptions={supportedOptions}
      analysis={httpClient}
      Icon={Network}
      meta={httpClientMeta.meta}
    />
  );
};
