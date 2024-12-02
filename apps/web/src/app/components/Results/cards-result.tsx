import { AnalysisResult } from '@unbuilt/analyzer';
import { FC, useEffect, useMemo, useState } from 'react';
import { UILibrariesCard } from './cards/ui-libraries';
import { MetaFrameworkCard } from './cards/meta-framework';
import { BuildCard } from './cards/build';
import { StylingCard } from './cards/styling';
import { PerformanceCard } from './cards/performance';

export const CardsResult: FC<{ result: AnalysisResult }> = ({ result }) => {
  const truncatedUrl = useMemo(() => {
    const url = new URL(result.url);
    return `${url.host}${url.pathname === '/' ? '' : url.pathname}`;
  }, [result.url]);

  useEffect(() => {
    document.title = `Unbuilt ${truncatedUrl}`;
  }, [truncatedUrl]);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Make each card to be sharable
  const handleItemClick = (item: string) => {
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
        {result.uiLib && <UILibrariesCard uiLib={result.uiLib} />}
        {result.metaFramework && (
          <MetaFrameworkCard metaFramework={result.metaFramework} />
        )}
        {result.build && <BuildCard build={result.build} />}
        {result.styling && <StylingCard styling={result.styling} />}
        {result.performance && (
          <PerformanceCard performance={result.performance} />
        )}
      </div>
    </div>
  );
};
