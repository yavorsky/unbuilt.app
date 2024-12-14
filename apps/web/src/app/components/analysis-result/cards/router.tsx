import { FC } from 'react';
import { AnalysisKeys, AnalyzeResult, routerPatterns } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Calendar } from 'lucide-react';

const supportedOptions = Object.keys(routerPatterns).map(capitalize);

export const RouterCard: FC<{
  router: AnalyzeResult['analysis']['router'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ router, onCardSelect }) => {
  return (
    <SingleResultAnalysisCard
      name="router"
      supportedOptions={supportedOptions}
      analysis={router}
      Icon={Calendar}
      onCardSelect={onCardSelect}
    />
  );
};
