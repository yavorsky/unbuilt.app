import { FC } from 'react';
import { AnalysisKeys, AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Calendar } from 'lucide-react';
import { dates } from '@unbuilt/features';

const supportedOptions = Object.keys(dates.patterns).map(capitalize);

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
