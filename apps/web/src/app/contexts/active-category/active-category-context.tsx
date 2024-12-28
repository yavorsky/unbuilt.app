'use client';

import { AnalysisKeys } from '@unbuilt/analyzer';
import { createContext } from 'react';

type ActiveCategoryContextType = {
  activeCategory: AnalysisKeys | null;
  activeCategoryLabel: string | null;
  updateActiveCategory: (activeCategory: AnalysisKeys | null) => void;
  clearActiveCategory: () => void;
};

export const ActiveCategoryContext =
  createContext<ActiveCategoryContextType | null>(null);
