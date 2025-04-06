import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export const useActiveRoute = () => {
  const pathname = usePathname();

  return useMemo(() => {
    if (pathname === '/' || pathname.startsWith('/analysis')) {
      return 'ANALYZE';
    }
    if (pathname.startsWith('/technologies')) {
      return 'TECHNOLOGIES';
    }

    if (pathname.startsWith('/about')) {
      return 'ABOUT';
    }

    return 'NOT_FOUND';
  }, [pathname]);
};
