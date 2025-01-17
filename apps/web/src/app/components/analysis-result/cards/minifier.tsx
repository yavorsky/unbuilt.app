import { FC } from 'react';
import { Minimize2 } from 'lucide-react';
import { minifierMeta } from '@unbuilt/features';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(minifierMeta.meta);

export const MinifierCard: FC<{
  minifier: AnalyzeResult['analysis']['minifier'] | undefined;
}> = ({ minifier }) => {
  return (
    <SingleResultAnalysisCard
      name="minifier"
      analysis={minifier}
      Icon={Minimize2}
      supportedOptions={supportedOptions}
      meta={minifierMeta.meta}
    />
  );
};
