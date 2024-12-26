import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { framework as frameworkFeatures } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Boxes } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(frameworkFeatures.meta);

export const FrameworkCard: FC<{
  framework: AnalyzeResult['analysis']['framework'] | undefined;
}> = ({ framework }) => {
  return (
    <SingleResultAnalysisCard
      name="framework"
      supportedOptions={supportedOptions}
      analysis={framework}
      Icon={Boxes}
      meta={frameworkFeatures.meta}
    />
  );
};
