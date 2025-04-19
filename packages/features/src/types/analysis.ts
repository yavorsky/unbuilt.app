import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import * as allFeatures from '../index.js';

type AnalysisResult<
  T extends (
    page: Page,
    browser: Browser,
    resources: Resources,
    analysis?: AnalysisFeatures
  ) => Promise<unknown>,
> = Awaited<ReturnType<T>>;

export type AnalysisFeatures = {
  bundler: AnalysisResult<typeof allFeatures.bundler.detect>;
  framework: AnalysisResult<typeof allFeatures.framework.detect>;
  minifier: AnalysisResult<typeof allFeatures.minifier.detect>;
  stylingProcessor: AnalysisResult<typeof allFeatures.stylingProcessor.detect>;
  modules: AnalysisResult<typeof allFeatures.modules.detect>;
  uiLibrary: AnalysisResult<typeof allFeatures.uiLibrary.detect>;
  stateManagement: AnalysisResult<typeof allFeatures.stateManagement.detect>;
  httpClient: AnalysisResult<typeof allFeatures.httpClient.detect>;
  router: AnalysisResult<typeof allFeatures.router.detect>;
  translations: AnalysisResult<typeof allFeatures.translations.detect>;
  dates: AnalysisResult<typeof allFeatures.dates.detect>;
  stylingLibraries: AnalysisResult<typeof allFeatures.stylingLibraries.detect>;
  transpiler: AnalysisResult<typeof allFeatures.transpiler.detect>;
  monitoring: AnalysisResult<typeof allFeatures.monitoring.detect>;
  platform: AnalysisResult<typeof allFeatures.platform.detect>;
  analytics: AnalysisResult<typeof allFeatures.analytics.detect>;
};

export type AnalysisKeys = keyof AnalysisFeatures;
