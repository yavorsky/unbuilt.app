import { FC } from 'react';
import {
  AnalysisKeys,
  AnalyzeResult,
  frameworkPatterns,
} from '@unbuilt/analyzer';
import { AnalysisCard } from './single-result-card';
import { capitalize } from 'lodash-es';
import { Boxes } from 'lucide-react';

const supportedOptions = Object.keys(frameworkPatterns).map(capitalize);

export const FrameworkCard: FC<{
  framework: AnalyzeResult['analysis']['framework'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ framework, onCardSelect }) => {
  return (
    <AnalysisCard
      name="framework"
      supportedOptions={supportedOptions}
      analysis={framework}
      Icon={Boxes}
      onCardSelect={onCardSelect}
    />
  );
};

export default FrameworkCard;
