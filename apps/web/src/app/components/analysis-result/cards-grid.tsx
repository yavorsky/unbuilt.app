import { AnalysisKeys, OnProgressResult } from '@unbuilt/analyzer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FrameworkCard } from './cards/framework';
import { BundlerCard } from './cards/bundler';
import { TranspilerCard } from './cards/transpiler';
import { UILibraryCard } from './cards/ui-library';
import { MinifierCard } from './cards/minifier';
import { ModulesCard } from './cards/modules';
import { StylingLibrariesCard } from './cards/styling-libraries';
import { StylingProcessorCard } from './cards/styling-processor';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { LogoIcon } from '../icons/logo';
import { URLBreadcrumb } from './url-breadcrumb';
import { HTTPClientCard } from './cards/http-client';
import { StateManagementCard } from './cards/state-management';
import { DatesCard } from './cards/dates';
import { RouterCard } from './cards/router';

export const CardsGrid: FC<{
  result: OnProgressResult | null;
  progress: number | null;
  isLoading: boolean;
}> = ({ result }) => {
  const truncatedUrl = useMemo(() => {
    if (!result) {
      return '';
    }
    const url = new URL(result.url);
    return `${url.host}${url.pathname === '/' ? '' : url.pathname}`;
  }, [result]);

  useEffect(() => {
    document.title = `Unbuilt ${truncatedUrl}`;
  }, [truncatedUrl]);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Make each card to be sharable
  const handleItemClick = useCallback(
    (item: AnalysisKeys) => {
      setSelectedItem(item === selectedItem ? null : item);
      if (item !== selectedItem) {
        const url = new URL(window.location.href);
        url.hash = item;
      }
    },
    [selectedItem]
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="pb-8 border-b border-gray-900 flex items-center justify-center max-w-7xl mx-auto">
        <div className="flex-1 flex items-center justify-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="text-xl">
                <BreadcrumbLink asChild>
                  <Link href="/">
                    <LogoIcon size={40} />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {truncatedUrl ? (
                <URLBreadcrumb url={truncatedUrl} />
              ) : (
                <Loader2 className="h-5 w-5 mx-16 animate-spin text-white" />
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
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
