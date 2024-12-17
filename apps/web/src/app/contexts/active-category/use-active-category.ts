'use client';

import { useContext } from 'react';
import { ActiveCategoryContext } from './active-category-context';

export function useActiveCategory() {
  const context = useContext(ActiveCategoryContext);
  if (!context) {
    throw new Error(
      'useActiveAnalysis must be used within ActiveAnalysisProvider'
    );
  }
  return context;
}
