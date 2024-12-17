'use client';

import { AnalysisKeys } from '@unbuilt/analyzer';
import { createContext } from 'react';

type ActiveCategoryContextType = {
  activeCategory: AnalysisKeys | null;
  updateActiveCategory: (activeCategory: AnalysisKeys) => void;
  clearActiveCategory: () => void;
};

export const ActiveCategoryContext =
  createContext<ActiveCategoryContextType | null>(null);
