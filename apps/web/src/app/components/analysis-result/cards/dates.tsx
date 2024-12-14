import { FC } from 'react';
import { AnalysisKeys, AnalyzeResult, datesPatterns } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Calendar } from 'lucide-react';

const supportedOptions = Object.keys(datesPatterns).map(capitalize);

export const DatesCard: FC<{
  dates: AnalyzeResult['analysis']['dates'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ dates, onCardSelect }) => {
  return (
    <SingleResultAnalysisCard
      name="dates"
      supportedOptions={supportedOptions}
      analysis={dates}
      Icon={Calendar}
      onCardSelect={onCardSelect}
    />
  );
};
