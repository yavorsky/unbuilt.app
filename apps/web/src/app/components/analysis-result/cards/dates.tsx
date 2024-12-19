import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Calendar } from 'lucide-react';
import { dates } from '@unbuilt/features';

const supportedOptions = Object.keys(dates.patterns).map(capitalize);

export const DatesCard: FC<{
  dates: AnalyzeResult['analysis']['dates'] | undefined;
}> = ({ dates }) => {
  return (
    <SingleResultAnalysisCard
      name="dates"
      supportedOptions={supportedOptions}
      analysis={dates}
      Icon={Calendar}
    />
  );
};
