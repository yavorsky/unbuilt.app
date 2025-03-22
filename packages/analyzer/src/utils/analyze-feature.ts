import {
  bundler,
  framework,
  httpClient,
  platform,
  translations,
  minifier,
  modules,
  stylingLibraries,
  stylingProcessor,
  transpiler,
  uiLibrary,
  stateManagement,
  dates,
  router,
  getStats,
  analytics,
} from '@unbuilt/features';

import { OnProgressHandler } from './progress.js';
import { Resources } from '@unbuilt/resources';
import { AnalysisFeaturesWithStats } from '../types.js';
import { Browser, Page } from 'playwright';

export const detectionMap = {
  framework: framework.detect,
  uiLibrary: uiLibrary.detect,
  router: router.detect,
  bundler: bundler.detect,
  transpiler: transpiler.detect,
  minifier: minifier.detect,
  stylingProcessor: stylingProcessor.detect,
  modules: modules.detect,
  httpClient: httpClient.detect,
  platform: platform.detect,
  translations: translations.detect,
  dates: dates.detect,
  stateManagement: stateManagement.detect,
  stylingLibraries: stylingLibraries.detect,
  analytics: analytics.detect,
  stats: getStats,
};

export const analyzeFeature = async function <
  T extends keyof AnalysisFeaturesWithStats,
>({
  featureName,
  analysis,
  page,
  browser,
  resources,
  onProgress,
  initialAnalysis,
}: {
  featureName: T;
  analysis: AnalysisFeaturesWithStats;
  page: Page;
  browser: Browser;
  resources: Resources;
  onProgress?: OnProgressHandler;
  initialAnalysis?: AnalysisFeaturesWithStats;
}) {
  const isInitialRun = !initialAnalysis;
  if (isInitialRun) {
    console.time(featureName);
  }
  const detect = detectionMap[featureName];
  const result = await detect(page, browser, resources, initialAnalysis);
  analysis[featureName] = result as AnalysisFeaturesWithStats[T];
  if (isInitialRun) {
    onProgress?.({ [featureName]: result });
    console.timeEnd(featureName);
  }
};

export const detectionCategories = Object.keys(
  detectionMap
) as (keyof AnalysisFeaturesWithStats)[];
