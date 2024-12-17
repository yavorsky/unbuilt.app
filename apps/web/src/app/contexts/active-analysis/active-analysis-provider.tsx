'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';
import {
  ActiveAnalysis,
  ActiveAnalysisContext,
} from './active-analysis-context';

export function ActiveAnalysisProvider({ children }: { children: ReactNode }) {
  const [activeAnalysis, setActiveAnalysis] = useState<ActiveAnalysis | null>(
    null
  );

  const updateActiveAnalysis = useCallback((analysis: ActiveAnalysis) => {
    setActiveAnalysis(analysis);
  }, []);

  const clearActiveAnalysis = useCallback(() => {
    setActiveAnalysis(null);
  }, []);

  const value = useMemo(() => {
    return { activeAnalysis, updateActiveAnalysis, clearActiveAnalysis };
  }, [activeAnalysis, updateActiveAnalysis, clearActiveAnalysis]);

  return (
    <ActiveAnalysisContext.Provider value={value}>
      {children}
    </ActiveAnalysisContext.Provider>
  );
}
