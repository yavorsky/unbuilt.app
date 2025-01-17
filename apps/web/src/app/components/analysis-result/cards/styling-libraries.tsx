import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { stylingLibrariesMeta } from '@unbuilt/features';
import { MultiResultAnalysisCard } from './common/multi-results-card';
import { Paintbrush } from 'lucide-react';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(stylingLibrariesMeta.meta);

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
      meta={stylingLibrariesMeta?.meta}
    />
  );
};
