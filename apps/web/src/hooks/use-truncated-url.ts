import { useCallback, useMemo } from 'react';

export const useTruncatedUrl = (url?: string | null) => {
  const trancateUrl = useTruncatedUrlCallback();
  return useMemo(() => {
    return trancateUrl(url);
  }, [url, trancateUrl]);
};

export const useTruncatedUrlCallback = () => {
  return useCallback((url?: string | null) => {
    if (!url) {
      return '';
    }
    const res = new URL(url);
    return `${res.host}${res.pathname === '/' ? '' : res.pathname}`;
  }, []);
};
