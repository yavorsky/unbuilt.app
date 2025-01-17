import { FC } from 'react';
import { Component } from 'lucide-react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';

export const UILibraryCard: FC<{
  uiLibrary: AnalyzeResult['analysis']['uiLibrary'] | undefined;
}> = ({ uiLibrary }) => {
  return (
    <SingleResultAnalysisCard
      name="uiLibrary"
      analysis={uiLibrary}
      Icon={Component}
    />
  );
};
