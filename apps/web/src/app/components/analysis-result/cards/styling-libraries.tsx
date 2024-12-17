import { FC } from 'react';
import { AnalysisKeys, AnalyzeResult } from '@unbuilt/analyzer';
import { MultiResultAnalysisCard } from './common/multi-results-card';
import { Paintbrush } from 'lucide-react';
import { capitalize } from 'lodash-es';
import { stylingLibraries } from '@unbuilt/features';

const supportedOptions = Object.keys(stylingLibraries.patterns).map(capitalize);

export const StylingLibrariesCard: FC<{
  stylingLibraries: AnalyzeResult['analysis']['stylingLibraries'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ stylingLibraries, onCardSelect }) => {
  return (
    <MultiResultAnalysisCard
      name="stylingLibraries"
      analysis={stylingLibraries}
      Icon={Paintbrush}
      onCardSelect={onCardSelect}
      supportedOptions={supportedOptions}
    />
  );
};
