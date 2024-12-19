import { FC } from 'react';
import { Minimize2 } from 'lucide-react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { minifier } from '@unbuilt/features';

const supportedOptions = Object.keys(minifier.patterns).map(capitalize);

export const MinifierCard: FC<{
  minifier: AnalyzeResult['analysis']['minifier'] | undefined;
}> = ({ minifier }) => {
  return (
    <SingleResultAnalysisCard
      name="minifier"
      analysis={minifier}
      Icon={Minimize2}
      supportedOptions={supportedOptions}
    />
  );
};
