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
  monitoring,
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
  monitoring: monitoring.detect,
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
  debug,
}: {
  featureName: T;
  analysis: AnalysisFeaturesWithStats;
  page: Page;
  browser: Browser;
  resources: Resources;
  onProgress?: OnProgressHandler;
  initialAnalysis?: AnalysisFeaturesWithStats;
  debug?: boolean;
}) {
  const isInitialRun = !initialAnalysis;
  if (isInitialRun && debug) {
    console.time(featureName);
  }
  const detect = detectionMap[featureName];
  const result = await detect(page, browser, resources, initialAnalysis);
  analysis[featureName] = result as AnalysisFeaturesWithStats[T];
  if (isInitialRun) {
    onProgress?.({ [featureName]: result });
    if (debug) {
      console.timeEnd(featureName);
    }
  }
};

export const detectionCategories = Object.keys(
  detectionMap
) as (keyof AnalysisFeaturesWithStats)[];
