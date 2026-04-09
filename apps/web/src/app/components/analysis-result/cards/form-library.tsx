import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { ClipboardList } from 'lucide-react';

export const FormLibraryCard: FC<{
  formLibrary: AnalyzeResult['analysis']['formLibrary'] | undefined;
}> = ({ formLibrary }) => {
  return (
    <SingleResultAnalysisCard
      name="formLibrary"
      analysis={formLibrary}
      Icon={ClipboardList}
      withSecondaryMatches={false}
    />
  );
};
