import { FC } from 'react';
import { Component } from 'lucide-react';
import { AnalysisKeys, AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';
import { uiLibrary } from '@unbuilt/features';

const supportedOptions = Object.keys(uiLibrary.patterns).map(capitalize);

export const UILibraryCard: FC<{
  uiLibrary: AnalyzeResult['analysis']['uiLibrary'] | undefined;
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ uiLibrary, onCardSelect }) => {
  return (
    <SingleResultAnalysisCard
      name="uiLibrary"
      analysis={uiLibrary}
      Icon={Component}
      onCardSelect={onCardSelect}
      supportedOptions={supportedOptions}
    />
  );
};
