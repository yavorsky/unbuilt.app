import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Calendar } from 'lucide-react';
import { router } from '@unbuilt/features';

const supportedOptions = Object.keys(router.patterns).map(capitalize);

export const RouterCard: FC<{
  router: AnalyzeResult['analysis']['router'] | undefined;
}> = ({ router }) => {
  return (
    <SingleResultAnalysisCard
      name="router"
      supportedOptions={supportedOptions}
      analysis={router}
      Icon={Calendar}
    />
  );
};
