'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '../utils/analytics';

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view when the path or search params change
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
