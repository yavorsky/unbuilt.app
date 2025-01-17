import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { routerMeta } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Calendar } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(routerMeta.meta);

export const RouterCard: FC<{
  router: AnalyzeResult['analysis']['router'] | undefined;
}> = ({ router }) => {
  return (
    <SingleResultAnalysisCard
      name="router"
      supportedOptions={supportedOptions}
      analysis={router}
      meta={routerMeta.meta}
      Icon={Calendar}
    />
  );
};
