import { getAnalysisMetaByUrl } from '@/actions';
import { debounce } from 'lodash-es';
import { useEffect, useState, useCallback } from 'react';
import { validateUrl } from '../utils/validate-url';

type URL = string;
export const statuses = {
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND',
  PENDING: 'PENDING',
  NO_URL: 'NO_URL',
} as const;

type AnalysisMeta = { id: string; analyzedAt: string };
type State = Record<URL, AnalysisMeta>;

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
          [urlToFetch]: { id: result?.id, analyzedAt: result?.analyzedAt },
        }));
      } catch (e) {
        console.error('Error checking URL:', e, urlToFetch);
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
