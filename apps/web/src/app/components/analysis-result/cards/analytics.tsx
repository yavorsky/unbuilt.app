import { FC } from 'react';
import type { AnalysisFeatures } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { ChartColumn } from 'lucide-react';

export const AnalyticsCard: FC<{
  analytics: AnalysisFeatures['analytics'] | undefined;
}> = ({ analytics }) => {
  return (
    <SingleResultAnalysisCard
      name="analytics"
      analysis={analytics}
      Icon={ChartColumn}
      withSecondaryMatches={true}
      secondaryMatchesLabel="Additional Analytics"
      isSecondaryMatchesExpanded={true}
    />
  );
};
