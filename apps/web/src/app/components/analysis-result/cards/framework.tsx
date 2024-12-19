import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { framework as frameworkFeatures } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { Boxes } from 'lucide-react';

const supportedOptions = Object.keys(frameworkFeatures.patterns).map(
  capitalize
);

export const FrameworkCard: FC<{
  framework: AnalyzeResult['analysis']['framework'] | undefined;
}> = ({ framework }) => {
  return (
    <SingleResultAnalysisCard
      name="framework"
      supportedOptions={supportedOptions}
      analysis={framework}
      Icon={Boxes}
      meta={frameworkFeatures?.meta}
    />
  );
};
