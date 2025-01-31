'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { URLBreadcrumb } from '../analysis-result/url-breadcrumb';
import { useCallback, useMemo } from 'react';
import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { useParams } from 'next/navigation';
import { useActiveAnalysis } from '@/app/contexts/active-analysis';
import { CopyIcon } from 'lucide-react';
import { useActiveCategory } from '@/app/hooks/use-active-categoy';
import {
  getTechnologyMetaForType,
  TechnologyMetaResults,
} from '@/app/utils/get-technology-meta';
import { useActiveRoute } from '@/app/hooks/use-active-route';

export function NavigationBreadcrumb<
  T extends AnalysisTechnologies,
  M extends TechnologyMetaResults<T>,
>() {
  const params = useParams<{
    name: string;
    type: T;
  }>();
  const { toast } = useToast();
  const { activeAnalysis } = useActiveAnalysis();

  const { activeCategoryLabel } = useActiveCategory();
  const activeRoute = useActiveRoute();

  const truncatedUrl = useMemo(() => {
    if (!activeAnalysis?.url) {
      return null;
    }
    const url = new URL(activeAnalysis?.url);
    return `${url.host}${url.pathname === '/' ? '' : url.pathname}`;
  }, [activeAnalysis]);

  const handleCopyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({
      description: 'Analysis URL copied to clipboard',
      duration: 2000,
    });
  }, [toast]);

  const breadcrumbForRoute = useMemo(() => {
    if (activeRoute === 'ANALYZE' && truncatedUrl) {
      return (
        <div className="flex items-center gap-2">
          <BreadcrumbSeparator className="hidden md:inline" />
          <URLBreadcrumb
            className="hidden md:inline"
            skipSubmit
            skipBackground
            variant="medium"
            url={truncatedUrl}
          />
          {activeCategoryLabel && (
            <>
              <BreadcrumbSeparator className="-ml-3 hidden md:inline" />
              <BreadcrumbItem className="text-foreground text-lg hidden md:inline">
                {activeCategoryLabel}
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbItem
            className={`hidden md:inline ${activeCategoryLabel ? 'ml-2' : '-ml-2'}`}
          >
            <CopyIcon
              className="cursor-pointer transition-colors hover:text-blue-500"
              size={14}
              onClick={handleCopyUrl}
            />
          </BreadcrumbItem>
        </div>
      );
    }
    if (activeRoute === 'TECHNOLOGIES') {
      const subTechnologyMeta =
        params.type && params.name
          ? getTechnologyMetaForType(params.type, params.name as M)
          : null;

      return (
        <>
          <BreadcrumbSeparator className="hidden md:inline" />
          <BreadcrumbItem className="text-foreground text-lg hidden md:inline">
            <BreadcrumbLink href="/technologies">Technologies</BreadcrumbLink>
          </BreadcrumbItem>
          {subTechnologyMeta && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-foreground text-lg hidden md:inline">
                {subTechnologyMeta.name}
              </BreadcrumbItem>
            </>
          )}
        </>
      );
    }
  }, [activeRoute, activeCategoryLabel, truncatedUrl, handleCopyUrl, params]);

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbForRoute}</BreadcrumbList>
    </Breadcrumb>
  );
}
