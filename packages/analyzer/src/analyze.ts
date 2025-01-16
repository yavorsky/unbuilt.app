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
} from '@unbuilt/features';
import { Resources } from '@unbuilt/resources';
import { checkUrlAvailability } from './utils/check-for-availability.js';

export const analyze = async (
  url: string,
  page: Page,
  browser: Browser,
  handleProgress: OnProgress
) => {
  const startedAt = new Date();

  const isAvailable = await checkUrlAvailability(page, url);
  if (!isAvailable) {
    throw new Error('Resource is not available.');
  }

  // TODO: Resources to function
  const resources = new Resources(page);
  await resources.initialize();

  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 10000,
  });

  const onProgress = createProgressTracker(url, handleProgress, startedAt, 14);

  const bundlerAnalysis = await bundler.detect(page, browser, resources);
  onProgress({ bundler: bundlerAnalysis });
  const transpilerAnalysis = await transpiler.detect(page, browser, resources);
  onProgress({ transpiler: transpilerAnalysis });
  const frameworkAnalysis = await framework.detect(page, browser, resources);
  onProgress({ framework: frameworkAnalysis });
  const minifierAnalysis = await minifier.detect(page, browser, resources);
  onProgress({ minifier: minifierAnalysis });
  const stylingProcessorAnalysis = await stylingProcessor.detect(
    page,
    browser,
    resources
  );
  onProgress({ stylingProcessor: stylingProcessorAnalysis });
  const modulesAnalysis = await modules.detect(page, browser, resources);
  onProgress({ modules: modulesAnalysis });
  const uiLibraryAnalysis = await uiLibrary.detect(page, browser, resources);
  onProgress({ uiLibrary: uiLibraryAnalysis });
  const httpClientAnalysis = await httpClient.detect(page, browser, resources);
  onProgress({ httpClient: httpClientAnalysis });
  const stateManagementAnalysis = await stateManagement.detect(
    page,
    browser,
    resources
  );
  onProgress({ stateManagement: stateManagementAnalysis });
  const datesAnalysis = await dates.detect(page, browser, resources);
  onProgress({ dates: datesAnalysis });
  const routerAnalysis = await router.detect(page, browser, resources);
  onProgress({ router: routerAnalysis });
  const stylingLibrariesAnalysis = await stylingLibraries.detect(
    page,
    browser,
    resources
  );
  onProgress({ stylingLibraries: stylingLibrariesAnalysis });

  const translationsAnalysis = await translations.detect(
    page,
    browser,
    resources
  );
  onProgress({ translations: translationsAnalysis });

  const stats = await getStats(page);
  onProgress({ stats });

  const finishedAt = new Date();
  const duration = finishedAt.getTime() - startedAt.getTime();

  return {
    url,
    timestamp: finishedAt.toISOString(),
    duration,
    analysis: {
      bundler: bundlerAnalysis,
      transpiler: transpilerAnalysis,
      framework: frameworkAnalysis,
      minifier: minifierAnalysis,
      stylingProcessor: stylingProcessorAnalysis,
      modules: modulesAnalysis,
      router: routerAnalysis,
      dates: datesAnalysis,
      translations: translationsAnalysis,
      stateManagement: stateManagementAnalysis,
      uiLibrary: uiLibraryAnalysis,
      httpClient: httpClientAnalysis,
      stylingLibraries: stylingLibrariesAnalysis,
      stats,
    },
  };
};

export type AnalyzeResult = Awaited<ReturnType<typeof analyze>>;
