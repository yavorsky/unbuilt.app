import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Calendar } from 'lucide-react';
import { dates as datesFeature } from '@unbuilt/features';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(datesFeature.meta);

export const DatesCard: FC<{
  dates: AnalyzeResult['analysis']['dates'] | undefined;
}> = ({ dates }) => {
  return (
    <SingleResultAnalysisCard
      name="dates"
      supportedOptions={supportedOptions}
      analysis={dates}
      Icon={Calendar}
      meta={datesFeature.meta}
    />
  );
};
