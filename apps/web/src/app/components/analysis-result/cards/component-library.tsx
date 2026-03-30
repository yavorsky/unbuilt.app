import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Box } from 'lucide-react';

export const ComponentLibraryCard: FC<{
  componentLibrary: AnalyzeResult['analysis']['componentLibrary'] | undefined;
}> = ({ componentLibrary }) => {
  return (
    <SingleResultAnalysisCard
      name="componentLibrary"
      analysis={componentLibrary}
      Icon={Box}
      withSecondaryMatches={false}
    />
  );
};
