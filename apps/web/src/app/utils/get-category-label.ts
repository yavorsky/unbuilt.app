// A simple utility method that convers category id to a human readable label.
// We'll replace it with translations library in the future.

import { AnalysisFeaturesWithStats, AnalysisKeys } from '@unbuilt/analyzer';

const categoryLabelsMap: Record<keyof AnalysisFeaturesWithStats, string> = {
  bundler: 'Bundler',
  dates: 'Dates Library',
  framework: 'Framework',
  httpClient: 'HTTP Client',
  platform: 'Platform',
  uiLibrary: 'UI Library',
  minifier: 'Minifier',
  modules: 'Modules',
  router: 'Router',
  stateManagement: 'State Management',
  stylingLibraries: 'Styling Libraries',
  stylingProcessor: 'Styling Processor',
  transpiler: 'Transpiler',
  translations: 'Translations Library',
  analytics: 'Analytics',
  stats: 'General Stats',
};

export const getCategoryLabel = (category: AnalysisKeys | null) => {
  if (!category) {
    return null;
  }
  return categoryLabelsMap[category];
};
