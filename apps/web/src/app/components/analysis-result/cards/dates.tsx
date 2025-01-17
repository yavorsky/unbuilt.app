import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { datesMeta } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Calendar } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(datesMeta.meta);

export const DatesCard: FC<{
  dates: AnalyzeResult['analysis']['dates'] | undefined;
}> = ({ dates }) => {
  return (
    <SingleResultAnalysisCard
      name="dates"
      supportedOptions={supportedOptions}
      analysis={dates}
      Icon={Calendar}
      meta={datesMeta.meta}
    />
  );
};
