import { getAnalysisMetaByUrl } from '@/actions';
import { debounce } from 'lodash-es';
import { useEffect, useState, useCallback } from 'react';
import { validateUrl } from '../utils/validate-url';
import * as Sentry from '@sentry/nextjs';
import { trackError } from '../utils/error-monitoring';

type URL = string;
export const statuses = {
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND',
  PENDING: 'PENDING',
  OUTDATED: 'OUTDATED',
  NO_URL: 'NO_URL',
} as const;

type AnalysisMeta = {
  id: string | undefined;
  analyzedAt: string | undefined;
  notProcessed: string[] | undefined;
};
type State = Record<URL, AnalysisMeta>;

const MAX_CACHE_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

const isOutdated = (analysisMeta: AnalysisMeta) => {
  if (!analysisMeta.analyzedAt) {
    return true;
  }
  const now = Date.now();
  const analyzedAt = new Date(analysisMeta.analyzedAt).getTime();

  const withNotProcessedCategories =
    (analysisMeta.notProcessed?.length ?? 0) > 0;

  return now - analyzedAt > MAX_CACHE_AGE || withNotProcessedCategories;
};

export const useExistingAnalysisMeta = (url: URL) => {
  const [analysisMap, setAnalysisMap] = useState<State>({});

  // Create a memoized, debounced version of the fetch function
  // eslint-disable-next-line react-hooks/exhaustive-deps -- TODO: Solve this via ref
  const debouncedFetch = useCallback(
    debounce(async (urlToFetch: string) => {
      if (!urlToFetch) return;

      try {
        const result = await getAnalysisMetaByUrl(urlToFetch);

        setAnalysisMap((prevMap) => ({
          ...prevMap,
          [urlToFetch]: {
            id: result?.id,
            analyzedAt: result?.analyzedAt,
            notProcessed: result?.notProcessed,
          },
        }));
      } catch (e) {
        // Capture with Sentry with additional context
        Sentry.withScope((scope) => {
          // Add relevant context
          scope.setExtra('url', urlToFetch);
          scope.setTag('operation', 'url_fetch');

          // You can add breadcrumbs for more context about what led to the error
          Sentry.addBreadcrumb({
            category: 'fetch',
            message: `Attempting to fetch URL: ${urlToFetch}`,
            level: 'info',
          });

          // Capture the exception with the enhanced scope
          trackError(e as Error, { url: urlToFetch });
        });
      }
    }, 300),
    [] // Empty dependencies since we don't want to recreate the debounced function
  );

  useEffect(() => {
    // Skip if URL is empty or already in cache
    if (!validateUrl(url) || analysisMap[url]) {
      return;
    }

    debouncedFetch(url);
  }, [url, analysisMap, debouncedFetch]);

  if (analysisMap[url] && analysisMap[url].id) {
    if (isOutdated(analysisMap[url])) {
      return {
        id: analysisMap[url].id,
        analyzedAt: analysisMap[url].analyzedAt,
        notProcessed: analysisMap[url].notProcessed,
        status: statuses.OUTDATED,
      };
    }
    return {
      id: analysisMap[url].id,
      analyzedAt: analysisMap[url].analyzedAt,
      status: statuses.FOUND,
    };
  } else if (analysisMap[url] && !analysisMap[url].id) {
    return { id: null, analyzedAt: null, status: statuses.NOT_FOUND };
  } else if (validateUrl(url)) {
    return { id: null, analyzedAt: null, status: statuses.PENDING };
  } else {
    return { id: null, analyzedAt: null, status: statuses.NO_URL };
  }
};
