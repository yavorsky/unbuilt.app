import { FC } from 'react';
import type { AnalyzeResult } from '@unbuilt/analyzer';
import { SingleResultAnalysisCard } from './common/single-result-card';
import { Table2 } from 'lucide-react';

export const TableLibraryCard: FC<{
  tableLibrary: AnalyzeResult['analysis']['tableLibrary'] | undefined;
}> = ({ tableLibrary }) => {
  return (
    <SingleResultAnalysisCard
      name="tableLibrary"
      analysis={tableLibrary}
      Icon={Table2}
      withSecondaryMatches={false}
    />
  );
};
