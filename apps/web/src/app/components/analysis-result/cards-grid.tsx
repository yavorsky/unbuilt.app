import { AnalysisKeys, OnProgressResult } from '@unbuilt/analyzer';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { FrameworkCard } from './cards/framework';
import { BundlerCard } from './cards/bundler';
import { TranspilerCard } from './cards/transpiler';
import { UILibraryCard } from './cards/ui-library';
import { MinifierCard } from './cards/minifier';
import { ModulesCard } from './cards/modules';
import { StylingLibrariesCard } from './cards/styling-libraries';
import { StylingProcessorCard } from './cards/styling-processor';
import { Loader2 } from 'lucide-react';
import { Breadcrumb, BreadcrumbList } from '@/components/ui/breadcrumb';
import { URLBreadcrumb } from './url-breadcrumb';
import { HTTPClientCard } from './cards/http-client';
import { StateManagementCard } from './cards/state-management';
import { DatesCard } from './cards/dates';
import { RouterCard } from './cards/router';
import { useActiveCategory } from '@/app/contexts/active-category';

export const CardsGrid: FC<{
  result: OnProgressResult | null;
  progress: number | null;
  isLoading: boolean;
}> = ({ result, isLoading }) => {
  const truncatedUrl = useMemo(() => {
    if (!result) {
      return '';
    }
    const url = new URL(result.url);
    return `${url.host}${url.pathname === '/' ? '' : url.pathname}`;
  }, [result]);
  const { updateActiveCategory } = useActiveCategory();

  const actionLabel = isLoading ? 'Unbuilding' : 'Unbuilt';

  useEffect(() => {
    document.title = `${actionLabel} ${truncatedUrl}`;
  }, [truncatedUrl, actionLabel]);

  const formattedDate = useMemo(() => {
    if (!result?.timestamp) {
      return null;
    }
    const date = new Date(result.timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }, [result]);

  // Make each card to be sharable
  const handleItemClick = useCallback(
    (item: AnalysisKeys) => {
      updateActiveCategory(item);
    },
    [updateActiveCategory]
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-gray-900 flex items-center justify-center max-w-7xl mx-auto flex-col h-20">
        <div className="flex-1 flex items-center justify-start">
          <Breadcrumb>
            <BreadcrumbList>
              <h3 className="text-foreground text-3xl">{actionLabel}</h3>
              {truncatedUrl ? (
                <URLBreadcrumb variant="large" url={truncatedUrl} />
              ) : (
                <Loader2 className="h-5 w-5 mx-16 animate-spin text-white" />
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <span className="text-foreground/50 mt-4 h-6">
          {formattedDate && (
            <>Tech stack results based on the analysis from {formattedDate}.</>
          )}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 pt-10">
        {/* First row - two items */}
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <FrameworkCard
            framework={result?.analysis.framework}
            onCardSelect={handleItemClick}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <UILibraryCard
            uiLibrary={result?.analysis.uiLibrary}
            onCardSelect={handleItemClick}
          />
        </div>

        {/* All subsequent items */}
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <RouterCard
            router={result?.analysis.router}
            onCardSelect={handleItemClick}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <BundlerCard
            bundler={result?.analysis.bundler}
            onCardSelect={handleItemClick}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <TranspilerCard
            transpiler={result?.analysis.transpiler}
            onCardSelect={handleItemClick}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <MinifierCard
            minifier={result?.analysis.minifier}
            onCardSelect={handleItemClick}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <HTTPClientCard
            httpClient={result?.analysis.httpClient}
            onCardSelect={handleItemClick}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <StateManagementCard
            stateManagement={result?.analysis.stateManagement}
            onCardSelect={handleItemClick}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <DatesCard
            dates={result?.analysis.dates}
            onCardSelect={handleItemClick}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <ModulesCard
            modules={result?.analysis.modules}
            onCardSelect={handleItemClick}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <StylingLibrariesCard
            stylingLibraries={result?.analysis.stylingLibraries}
            onCardSelect={handleItemClick}
          />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <StylingProcessorCard
            stylingProcessor={result?.analysis.stylingProcessor}
            onCardSelect={handleItemClick}
          />
        </div>
      </div>
    </div>
  );
};
