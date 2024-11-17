import { AnalysisResult } from '@unbuilt/analyzer';
import { FC } from 'react';
import { UILibrariesCard } from './cards/ui-libraries';
import { MetaFrameworkCard } from './cards/meta-framework';
import { BuildCard } from './cards/build';
import { StylingCard } from './cards/styling';
import { PerformanceCard } from './cards/performance';

export const CardsResult: FC<{ result: AnalysisResult }> = ({ result }) => {
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-2">Tech Stack Analysis</h1>
        <p className="text-white font-bold text-3xl">{result.url}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.uiLib && <UILibrariesCard uiLib={result.uiLib} />}
        {result.metaFramework && <MetaFrameworkCard metaFramework={result.metaFramework} />}
        {result.build && <BuildCard build={result.build} />}
        {result.styling && <StylingCard styling={result.styling} />}
        {result.performance && <PerformanceCard performance={result.performance} />}

      </div>
    </div>;
};
