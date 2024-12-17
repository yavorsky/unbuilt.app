'use client';

import { useContext } from 'react';
import { ActiveAnalysisContext } from './active-analysis-context';

export function useActiveAnalysis() {
  const context = useContext(ActiveAnalysisContext);
  if (!context) {
    throw new Error(
      'useActiveAnalysis must be used within ActiveAnalysisProvider'
    );
  }
  return context;
}
