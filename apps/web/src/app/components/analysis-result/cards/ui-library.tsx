import { FC } from 'react';
import { Component } from 'lucide-react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { uiLibraryMeta } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { getResultsName } from '@/app/utils/get-results-name';

const supportedOptions = getResultsName(uiLibraryMeta.meta);

export const UILibraryCard: FC<{
  uiLibrary: AnalyzeResult['analysis']['uiLibrary'] | undefined;
}> = ({ uiLibrary }) => {
  return (
    <SingleResultAnalysisCard
      name="uiLibrary"
      analysis={uiLibrary}
      Icon={Component}
      meta={uiLibraryMeta.meta}
      supportedOptions={supportedOptions}
    />
  );
};
