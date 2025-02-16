import { Browser, Page } from 'playwright';
import { createProgressTracker, OnProgress } from './progress.js';
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
  handleProgress?: OnProgress
): Promise<AnalyzeResult> => {
  const startedAt = new Date();

  const isAvailable = await checkUrlAvailability(page, url);
  if (!isAvailable) {
    throw new Error(errors.RESOURCE_NOT_AVAILABLE, { cause: url });
  }

  const resources = new Resources(page);

  await resources.initialize();

  try {
    // Initial domcontentloaded event. The main indicator page is ready to be analyzed.
    // We'll still need to ensure all scripts are loaded later.
    await page.goto(url, {
      waitUntil: 'domcontentloaded', // First wait for DOM
      timeout: 15000,
    });
  } catch (error) {
    console.error('[Resources loading error]', error, url);
    throw new Error('Error loading resources');
  }

  try {
    // Here we are loading for page load event and network idle. Sometimes, some requests are stuck.
    // In this case, we assume that we wait for 10 seconds and start analysis ignoring stucked requests.
    await Promise.all([
      page.waitForLoadState('load', { timeout: 10000 }),
      page.waitForLoadState('networkidle', { timeout: 10000 }),
    ]);
  } catch (e: unknown) {
    // Skipping network idle
    console.log('Skipping network idle', e);
  }

  const onProgress = createProgressTracker({
    url,
    id,
    onProgress: handleProgress,
    startedAt,
    totalResults: 15,
  });
  const analysis = {} as AnalysisFeaturesWithStats;

  console.time('framework');
  analysis.framework = await framework.detect(page, browser, resources);
  onProgress({ framework: analysis.framework });
  console.timeEnd('framework');

  console.time('uiLibrary');
  analysis.uiLibrary = await uiLibrary.detect(page, browser, resources);
  onProgress({ uiLibrary: analysis.uiLibrary });
  console.timeEnd('uiLibrary');

  console.time('router');
  analysis.router = await router.detect(page, browser, resources);
  onProgress({ router: analysis.router });
  console.timeEnd('router');

  console.time('bundler');
  analysis.bundler = await bundler.detect(page, browser, resources);
  onProgress({ bundler: analysis.bundler });
  console.timeEnd('bundler');

  console.time('transpiler');
  analysis.transpiler = await transpiler.detect(page, browser, resources);
  onProgress({ transpiler: analysis.transpiler });
  console.timeEnd('transpiler');

  console.time('minifier');
  analysis.minifier = await minifier.detect(page, browser, resources);
  onProgress({ minifier: analysis.minifier });
  console.timeEnd('minifier');

  console.time('stylingProcessor');
  analysis.stylingProcessor = await stylingProcessor.detect(
    page,
    browser,
    resources
  );
  onProgress({ stylingProcessor: analysis.stylingProcessor });
  console.timeEnd('stylingProcessor');

  console.time('modules');
  analysis.modules = await modules.detect(page, browser, resources);
  onProgress({ modules: analysis.modules });
  console.timeEnd('modules');

  console.time('httpClient');
  analysis.httpClient = await httpClient.detect(page, browser, resources);
  onProgress({ httpClient: analysis.httpClient });
  console.timeEnd('httpClient');

  console.time('platform');
  analysis.platform = await platform.detect(page, browser, resources);
  onProgress({ platform: analysis.platform });
  console.timeEnd('platform');

  console.time('stateManagement');
  analysis.stateManagement = await stateManagement.detect(
    page,
    browser,
    resources
  );
  onProgress({ stateManagement: analysis.stateManagement });
  console.timeEnd('stateManagement');

  console.time('dates');
  analysis.dates = await dates.detect(page, browser, resources);
  onProgress({ dates: analysis.dates });
  console.timeEnd('dates');

  console.time('stylingLibraries');
  analysis.stylingLibraries = await stylingLibraries.detect(
    page,
    browser,
    resources
  );
  onProgress({ stylingLibraries: analysis.stylingLibraries });
  console.timeEnd('stylingLibraries');

  console.time('translations');
  analysis.translations = await translations.detect(page, browser, resources);
  onProgress({ translations: analysis.translations });
  console.timeEnd('translations');

  console.time('stats');
  analysis.stats = await getStats(page);
  onProgress({ stats: analysis.stats });
  console.timeEnd('stats');

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
    analysis.platform,
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
    platform.detect(page, browser, resources, analysis),
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

  handleProgress?.(result, 100);

  await resources.cleanup();

  return result;
};

export type AnalysisFeaturesWithStats = AnalysisFeatures & { stats: Stats };
export type AnalyzeResult = {
  url: string;
  id: string;
  timestamp: string;
  duration: number;
  analysis: AnalysisFeaturesWithStats;
};
