import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { CloudAlert } from 'lucide-react';

export const ErrorTrackingCard: FC<{
  errorTracking: AnalyzeResult['analysis']['errorTracking'] | undefined;
}> = ({ errorTracking }) => {
  return (
    <SingleResultAnalysisCard
      name="errorTracking"
      analysis={errorTracking}
      Icon={CloudAlert}
    />
  );
};
