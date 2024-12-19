import { FC } from 'react';
import { Component } from 'lucide-react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { uiLibrary as uiLibraryFeature } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';

const supportedOptions = Object.keys(uiLibraryFeature.patterns).map(capitalize);

export const UILibraryCard: FC<{
  uiLibrary: AnalyzeResult['analysis']['uiLibrary'] | undefined;
}> = ({ uiLibrary }) => {
  return (
    <SingleResultAnalysisCard
      name="uiLibrary"
      analysis={uiLibrary}
      Icon={Component}
      meta={uiLibraryFeature?.meta}
      supportedOptions={supportedOptions}
    />
  );
};
