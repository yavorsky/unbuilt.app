import { createContext } from 'react';

type AnalysisFormContextType = {
  url: string;
  changeUrl: (url: string) => void;
  initialUrl?: string;
  touched: boolean;
};

export const AnalysisFormContext =
  createContext<AnalysisFormContextType | null>(null);
