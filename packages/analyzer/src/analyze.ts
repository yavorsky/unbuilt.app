import { Browser, Page } from 'playwright';
import { createProgressTracker, OnProgress } from './progress.js';
import {
  bundler,
  framework,
  httpClient,
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
  AnalysisFeatures,
  Stats,
} from '@unbuilt/features';
import { Resources } from '@unbuilt/resources';
import { checkUrlAvailability } from './utils/check-for-availability.js';
import { errors } from './utils/errors.js';

export const analyze = async (
  url: string,
  id: string,
  page: Page,
  browser: Browser,
  handleProgress: OnProgress
): Promise<AnalyzeResult> => {
  const startedAt = new Date();

  const isAvailable = await checkUrlAvailability(page, url);
  if (!isAvailable) {
    throw new Error(errors.RESOURCE_NOT_AVAILABLE);
  }

  // TODO: Resources to function
  const resources = new Resources(page);
  await resources.initialize();

  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 30000,
  });

  const onProgress = createProgressTracker(
    url,
    id,
    handleProgress,
    startedAt,
    15
  );
  const analysis = {} as AnalysisFeaturesWithStats;

  analysis.bundler = await bundler.detect(page, browser, resources);
  onProgress({ bundler: analysis.bundler });
  analysis.transpiler = await transpiler.detect(page, browser, resources);
  onProgress({ transpiler: analysis.transpiler });
  analysis.framework = await framework.detect(page, browser, resources);
  onProgress({ framework: analysis.framework });
  analysis.minifier = await minifier.detect(page, browser, resources);
  onProgress({ minifier: analysis.minifier });
  analysis.stylingProcessor = await stylingProcessor.detect(
    page,
    browser,
    resources
  );
  onProgress({ stylingProcessor: analysis.stylingProcessor });
  analysis.modules = await modules.detect(page, browser, resources);
  onProgress({ modules: analysis.modules });
  analysis.uiLibrary = await uiLibrary.detect(page, browser, resources);
  onProgress({ uiLibrary: analysis.uiLibrary });
  analysis.httpClient = await httpClient.detect(page, browser, resources);
  onProgress({ httpClient: analysis.httpClient });
  analysis.stateManagement = await stateManagement.detect(
    page,
    browser,
    resources
  );
  onProgress({ stateManagement: analysis.stateManagement });
  analysis.dates = await dates.detect(page, browser, resources);
  onProgress({ dates: analysis.dates });
  analysis.router = await router.detect(page, browser, resources);
  onProgress({ router: analysis.router });
  analysis.stylingLibraries = await stylingLibraries.detect(
    page,
    browser,
    resources
  );
  onProgress({ stylingLibraries: analysis.stylingLibraries });

  analysis.translations = await translations.detect(page, browser, resources);
  onProgress({ translations: analysis.translations });

  analysis.stats = await getStats(page);
  onProgress({ stats: analysis.stats });

  // Run checks again to get more accurate results having context from all features
  [
    analysis.bundler,
    analysis.transpiler,
    analysis.framework,
    analysis.minifier,
    analysis.stylingProcessor,
    analysis.modules,
    analysis.uiLibrary,
    analysis.httpClient,
    analysis.stateManagement,
    analysis.dates,
    analysis.router,
    analysis.stylingLibraries,
    analysis.translations,
  ] = await Promise.all([
    bundler.detect(page, browser, resources, analysis),
    transpiler.detect(page, browser, resources, analysis),
    framework.detect(page, browser, resources, analysis),
    minifier.detect(page, browser, resources, analysis),
    stylingProcessor.detect(page, browser, resources, analysis),
    modules.detect(page, browser, resources, analysis),
    uiLibrary.detect(page, browser, resources, analysis),
    httpClient.detect(page, browser, resources, analysis),
    stateManagement.detect(page, browser, resources, analysis),
    dates.detect(page, browser, resources, analysis),
    router.detect(page, browser, resources, analysis),
    stylingLibraries.detect(page, browser, resources, analysis),
    translations.detect(page, browser, resources, analysis),
  ]);

  const finishedAt = new Date();
  const duration = finishedAt.getTime() - startedAt.getTime();

  const result = {
    url,
    id,
    timestamp: finishedAt.toISOString(),
    duration,
    analysis,
  };

  handleProgress(result, 100);
  return result;
};

type AnalysisFeaturesWithStats = AnalysisFeatures & { stats: Stats };
export type AnalyzeResult = {
  url: string;
  id: string;
  timestamp: string;
  duration: number;
  analysis: AnalysisFeaturesWithStats;
};
