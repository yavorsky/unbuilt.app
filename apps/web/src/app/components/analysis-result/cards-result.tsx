import { AnalysisKeys, OnProgressResult } from '@unbuilt/analyzer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FrameworkCard } from './cards/framework';
import { BundlerCard } from './cards/bundler';
import { TranspilerCard } from './cards/transpiler';
import { UILibraryCard } from './cards/ui-library';
import MinifierCard from './cards/minifier';
import ModulesCard from './cards/modules';
import { JSLibrariesCard } from './cards/js-libraries';
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

export const CardsResult: FC<{
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
  }, [result?.url]);

  useEffect(() => {
    document.title = `Unbuilt ${truncatedUrl}`;
  }, [truncatedUrl]);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Make each card to be sharable
  const handleItemClick = useCallback((item: AnalysisKeys) => {
    setSelectedItem(item === selectedItem ? null : item);
    if (item !== selectedItem) {
      const url = new URL(window.location.href);
      url.hash = item;
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-16 mt-8 flex items-center justify-center max-w-7xl mx-auto">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BundlerCard
          bundler={result?.analysis.bundler}
          onCardSelect={handleItemClick}
        />
        <FrameworkCard
          framework={result?.analysis.framework}
          onCardSelect={handleItemClick}
        />
        <TranspilerCard
          transpiler={result?.analysis.transpiler}
          onCardSelect={handleItemClick}
        />

        <UILibraryCard
          uiLibrary={result?.analysis.uiLibrary}
          onCardSelect={handleItemClick}
        />

        <MinifierCard
          minifier={result?.analysis.minifier}
          onCardSelect={handleItemClick}
        />

        <ModulesCard
          modules={result?.analysis.modules}
          onCardSelect={handleItemClick}
        />

        <JSLibrariesCard jsLibraries={result?.analysis.jsLibraries} />

        <StylingLibrariesCard
          stylingLibraries={result?.analysis.stylingLibraries}
          onCardSelect={handleItemClick}
        />
        <StylingProcessorCard
          stylingProcessor={result?.analysis.stylingProcessor}
          onCardSelect={handleItemClick}
        />
      </div>
    </div>
  );
};
