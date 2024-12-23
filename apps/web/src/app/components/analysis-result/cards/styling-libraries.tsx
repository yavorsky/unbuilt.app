import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { stylingLibraries as stylingLibrariesFeture } from '@unbuilt/features';
import { MultiResultAnalysisCard } from './common/multi-results-card';
import { Paintbrush } from 'lucide-react';
import { capitalize } from 'lodash-es';

const supportedOptions = Object.keys(stylingLibrariesFeture.patterns).map(
  capitalize
);

export const StylingLibrariesCard: FC<{
  stylingLibraries: AnalyzeResult['analysis']['stylingLibraries'] | undefined;
}> = ({ stylingLibraries }) => {
  return (
    <MultiResultAnalysisCard
      name="stylingLibraries"
      label="Styling Libraries"
      analysis={stylingLibraries}
      Icon={Paintbrush}
      supportedOptions={supportedOptions}
      meta={stylingLibrariesFeture?.meta}
    />
  );
};
