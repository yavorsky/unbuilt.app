import * as allFeatures from '../index.js';

export type AnalysisFeatures = {
  bundler: Awaited<ReturnType<typeof allFeatures.bundler.detect>>;
  framework: Awaited<ReturnType<typeof allFeatures.framework.detect>>;
  minifier: Awaited<ReturnType<typeof allFeatures.minifier.detect>>;
  stylingProcessor: Awaited<
    ReturnType<typeof allFeatures.stylingProcessor.detect>
  >;
  modules: Awaited<ReturnType<typeof allFeatures.modules.detect>>;
  uiLibrary: Awaited<ReturnType<typeof allFeatures.uiLibrary.detect>>;
  stateManagement: Awaited<
    ReturnType<typeof allFeatures.stateManagement.detect>
  >;
  httpClient: Awaited<ReturnType<typeof allFeatures.httpClient.detect>>;
  router: Awaited<ReturnType<typeof allFeatures.router.detect>>;
  translations: Awaited<ReturnType<typeof allFeatures.translations.detect>>;
  dates: Awaited<ReturnType<typeof allFeatures.dates.detect>>;
  stylingLibraries: Awaited<
    ReturnType<typeof allFeatures.stylingLibraries.detect>
  >;
  transpiler: Awaited<ReturnType<typeof allFeatures.transpiler.detect>>;
};

export type AnalysisKeys = keyof AnalysisFeatures;
