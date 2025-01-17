import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { frameworkMeta } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Boxes } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(frameworkMeta.meta);

export const FrameworkCard: FC<{
  framework: AnalyzeResult['analysis']['framework'] | undefined;
}> = ({ framework }) => {
  return (
    <SingleResultAnalysisCard
      name="framework"
      supportedOptions={supportedOptions}
      analysis={framework}
      Icon={Boxes}
      meta={frameworkMeta.meta}
    />
  );
};
