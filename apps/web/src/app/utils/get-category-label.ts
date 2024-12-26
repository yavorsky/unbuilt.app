// A simple utility method that convers category id to a human readable label.
// We'll replace it with translations library in the future.

import { AnalyzeResult } from '@unbuilt/analyzer';

const categoryLabelsMap: Record<keyof AnalyzeResult['analysis'], string> = {
  bundler: 'Bundler',
  dates: 'Dates Library',
  framework: 'Framework',
  httpClient: 'HTTP Client',
  uiLibrary: 'UI Library',
  minifier: 'Minifier',
  modules: 'Modules',
  router: 'Router',
  stateManagement: 'State Management',
  stylingLibraries: 'Styling Libraries',
  stylingProcessor: 'Styling Processor',
  transpiler: 'Transpiler',
  translations: 'Translations Library',
  stats: 'General Stats',
};

export const getCategoryLabel = (category: keyof AnalyzeResult['analysis']) => {
  return categoryLabelsMap[category];
};
