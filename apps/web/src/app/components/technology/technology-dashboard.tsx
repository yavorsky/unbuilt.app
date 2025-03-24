'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDebouncedCallback } from 'use-debounce';
import { useHandleDateFormat } from '@/hooks/use-date-format';
import { AnalysisTechnologies, AnalyzeResult } from '@unbuilt/analyzer';
import type { TechnologyWebsites } from '@/server/api/get-technology-websites';
import { usePagination } from '@/app/hooks/use-pagination';
import { PaginationControl } from '../pagination-controls';
import { SearchInput } from '../search-input';
import { useQueryParams } from '@/app/hooks/use-query-params';
import { WebsitesTable } from '../websites-table';
import { getTechnologyWebsites } from '@/actions';
import { ExternalLinkIcon } from 'lucide-react';
import {
  getTechnologyMetaForType,
  TechnologyMetaResults,
} from '@/app/utils/get-technology-meta';
import { trackError } from '@/app/utils/error-monitoring';

interface TechnologyWebsitesProps<T extends AnalysisTechnologies> {
  initialData: TechnologyWebsites;
  type: T;
  technology: keyof AnalyzeResult['analysis'][T];
}

export function TechnologyDashboard<
  T extends AnalysisTechnologies,
  V extends TechnologyMetaResults<T>,
>({ initialData, type, technology }: TechnologyWebsitesProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = useQueryParams();
  const [isLoading, setIsLoading] = useState(false);

  // Query params --> State
  const searchParams = useSearchParams();
  const loadParams = useMemo(() => {
    const page = searchParams.get('page');
    const params = {
      type,
      technology,
      page: page ? parseInt(page, 10) : 1,
      search: searchParams.get('search') ?? undefined,
    };
    return {
      params,
      queryString: createQueryString({
        type,
        technology: params.technology as string,
        page: params.page.toString(),
        search: params.search ?? '',
      }),
    };
  }, [type, technology, searchParams, createQueryString]);

  const [dataCache, setDataCache] = useState({
    [loadParams.queryString]: initialData,
  });

  // State --> Cache
  useEffect(() => {
    const load = async () => {
      if (dataCache[loadParams.queryString]) {
        return;
      }
      setIsLoading(true);
      try {
        const { params } = loadParams;
        const data = await getTechnologyWebsites(params);

        setDataCache((cache) => {
          return {
            ...cache,
            [loadParams.queryString]: data,
          };
        });
      } catch (e) {
        trackError(e as Error, { url: loadParams.queryString });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [loadParams, dataCache]);

  // Cache --> Data
  const data = dataCache[loadParams.queryString];
  // Fallback data for meta data during loading stage
  const fallbackData = data ?? initialData;
  const totalPages = fallbackData.totalPages;

  // Controllers for query params
  const updateSearch = useDebouncedCallback(async (search: string) => {
    const newUrl = `${pathname}?${createQueryString({ search, page: '1' })}`;
    router.push(newUrl);
  }, 300);

  const handlePageChange = (newPage: number) => {
    const newUrl = `${pathname}?${createQueryString({ page: newPage.toString() })}`;
    router.push(newUrl);
  };
  const paginationRange = usePagination(loadParams.params.page, totalPages);

  // Date formatter
  const formatDate = useHandleDateFormat();

  const meta = getTechnologyMetaForType(type, technology as V);
  const Icon = meta?.Icon;
  const description = meta?.description;
  const website = meta?.website;

  return (
    <div className="container mx-auto px-4">
      <div className="mb-12">
        <div className="text-3xl font-bold mb-6 flex items-center gap-2">
          {Icon && (
            <Suspense>
              <Icon width={40} height={40} />
            </Suspense>
          )}
          {meta?.name} <span className="font-normal">usage stats</span>
        </div>
        <div className="gap-4 flex flex-col">
          <div className="text-foreground/70">
            Docs:{' '}
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-base hover:text-foreground transition-colors"
            >
              {website}
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>
          {description && (
            <p className="text-foreground/70 max-w-2xl">{description}</p>
          )}
        </div>
      </div>
      <Card className="bg-muted backdrop-blur-sm border">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Technology adopters</span>
            <span className="text-sm text-foreground/50">
              {fallbackData.data.length} of {fallbackData.totalCount}
            </span>
          </CardTitle>
          <div className="pt-2">
            <SearchInput
              initialValue={loadParams.params.search ?? ''}
              onSearch={updateSearch}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                Loading...
              </div>
            )}
            <WebsitesTable data={fallbackData.data} formatDate={formatDate} />
            <div className="mt-4">
              <PaginationControl
                currentPage={loadParams.params.page}
                totalPages={totalPages}
                paginationRange={paginationRange}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
