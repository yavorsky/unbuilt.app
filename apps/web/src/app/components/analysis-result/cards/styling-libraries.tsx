import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { MultiResultAnalysisCard } from './common/multi-results-card';
import { Paintbrush } from 'lucide-react';

export const StylingLibrariesCard: FC<{
  stylingLibraries: AnalyzeResult['analysis']['stylingLibraries'] | undefined;
}> = ({ stylingLibraries }) => {
  return (
    <MultiResultAnalysisCard
      name="stylingLibraries"
      analysis={stylingLibraries}
      Icon={Paintbrush}
    />
  );
};
