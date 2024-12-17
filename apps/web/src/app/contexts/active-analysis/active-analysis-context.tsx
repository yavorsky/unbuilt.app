'use client';

import { createContext } from 'react';

export type ActiveAnalysis = { url: string };
type ActiveAnalysisContextType = {
  activeAnalysis: ActiveAnalysis | null;
  updateActiveAnalysis: (analysis: ActiveAnalysis) => void;
  clearActiveAnalysis: () => void;
};

export const ActiveAnalysisContext =
  createContext<ActiveAnalysisContextType | null>(null);
