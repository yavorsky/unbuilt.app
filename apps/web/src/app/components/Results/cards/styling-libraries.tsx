import { FC } from 'react';
import {
  AnalysisKeys,
  AnalyzeResult,
  stylingLibraryPatterns,
} from '@unbuilt/analyzer';
import { MultiResultAnalysisCard } from './common/multi-results-card';
import { Paintbrush } from 'lucide-react';
import { capitalize } from 'lodash-es';

const supportedOptions = Object.keys(stylingLibraryPatterns).map(capitalize);

export const StylingLibrariesCard: FC<{
  stylingLibraries: AnalyzeResult['analysis']['stylingLibraries'];
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
