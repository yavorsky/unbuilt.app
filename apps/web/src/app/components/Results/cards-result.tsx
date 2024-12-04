import { AnalysisKeys, OnProgressResult } from '@unbuilt/analyzer';
import { FC, useEffect, useMemo, useState } from 'react';
import { FrameworkCard } from './cards/framework';
import { BundlerCard } from './cards/bundler';
import { Progress } from '@/components/ui/progress';
import { TranspilerCard } from './cards/transpiler';
import { UILibraryCard } from './cards/ui-library';
import MinifierCard from './cards/minifier';
import ModulesCard from './cards/modules';
import { JSLibrariesCard } from './cards/js-libraries';
import { StylingLibrariesCard } from './cards/styling-libraries';
import { StylingProcessorCard } from './cards/styling-processor';

export const CardsResult: FC<{
  result: OnProgressResult;
  progress: number;
  isLoading: boolean;
}> = ({ result, isLoading, progress }) => {
  const truncatedUrl = useMemo(() => {
    const url = new URL(result.url);
    return `${url.host}${url.pathname === '/' ? '' : url.pathname}`;
  }, [result.url]);

  useEffect(() => {
    document.title = `Unbuilt ${truncatedUrl}`;
  }, [truncatedUrl]);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Make each card to be sharable
  const handleItemClick = (item: AnalysisKeys) => {
    setSelectedItem(item === selectedItem ? null : item);
    if (item !== selectedItem) {
      const url = new URL(window.location.href);
      url.hash = item;
      window.history.pushState({}, '', url.toString());
    } else {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {isLoading && (
        <div className="flex items-center justify-center mt-20 max-w-7xl mx-auto">
          <Progress value={progress ?? 0} />
        </div>
      )}
      <div className="mb-8 flex items-center justify-center max-w-7xl mx-auto">
        <a
          href={result.url}
          target="_blank"
          className="text-white font-bold text-3xl"
          rel="noreferrer"
        >
          {truncatedUrl}
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.analysis.bundler && (
          <BundlerCard
            onCardSelect={handleItemClick}
            bundler={result.analysis.bundler}
          />
        )}
        {result.analysis.framework && (
          <FrameworkCard framework={result.analysis.framework} />
        )}
        {result.analysis.transpiler && (
          <TranspilerCard transpiler={result.analysis.transpiler} />
        )}
        {result.analysis.uiLibrary && (
          <UILibraryCard uiLibrary={result.analysis.uiLibrary} />
        )}
        {result.analysis.minifier && (
          <MinifierCard minifier={result.analysis.minifier} />
        )}
        {result.analysis.modules && (
          <ModulesCard modules={result.analysis.modules} />
        )}
        {result.analysis.jsLibraries && (
          <JSLibrariesCard jsLibraries={result.analysis.jsLibraries} />
        )}
        {result.analysis.stylingLibraries && (
          <StylingLibrariesCard
            stylingLibraries={result.analysis.stylingLibraries}
          />
        )}
        {result.analysis.stylingProcessor && (
          <StylingProcessorCard
            stylingProcessor={result.analysis.stylingProcessor}
          />
        )}
      </div>
    </div>
  );
};
