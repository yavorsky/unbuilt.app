'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '../utils/analytics';

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view when the path or search params change
    if (pathname) {
      const url = searchParams?.size
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
