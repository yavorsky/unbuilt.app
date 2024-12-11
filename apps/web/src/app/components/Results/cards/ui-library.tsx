import { FC } from 'react';
import { Component } from 'lucide-react';
import {
  AnalysisKeys,
  AnalyzeResult,
  uiLibraryPatterns,
} from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { capitalize } from 'lodash-es';

const supportedOptions = Object.keys(uiLibraryPatterns).map(capitalize);

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
