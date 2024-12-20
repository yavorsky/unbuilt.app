import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { router as routerFeature } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Calendar } from 'lucide-react';

const supportedOptions = Object.keys(routerFeature.patterns).map(capitalize);

export const RouterCard: FC<{
  router: AnalyzeResult['analysis']['router'] | undefined;
}> = ({ router }) => {
  return (
    <SingleResultAnalysisCard
      name="router"
      supportedOptions={supportedOptions}
      analysis={router}
      meta={routerFeature?.meta}
      Icon={Calendar}
    />
  );
};
