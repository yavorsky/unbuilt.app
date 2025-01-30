'use client';

import { useActiveAnalysis } from '@/app/contexts/active-analysis';
import { useActiveRoute } from '@/app/hooks/use-active-route';

export const LogoText = () => {
  const { activeAnalysis } = useActiveAnalysis();
  const activeRoute = useActiveRoute();

  if (activeRoute === 'ANALYZE' && !activeAnalysis) {
    return null;
  }

  return (
    <span className="ml-2 hidden sm:inline">
      Unbuilt
      <span className="text-foreground/80">.app</span>
    </span>
  );
};
