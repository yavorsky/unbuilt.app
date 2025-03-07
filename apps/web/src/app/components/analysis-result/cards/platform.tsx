import { FC } from 'react';
import type { AnalysisFeatures } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { OrbitIcon } from 'lucide-react';

export const PlatformCard: FC<{
  platform: AnalysisFeatures['platform'] | undefined;
}> = ({ platform }) => {
  return (
    <SingleResultAnalysisCard
      name="platform"
      analysis={platform}
      Icon={OrbitIcon}
      withSecondaryMatches={false}
    />
  );
};
