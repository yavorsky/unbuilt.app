import { Browser, Page } from 'playwright';
import { Resources } from './resources.js';
import { createProgressTracker, OnProgress } from './progress.js';
import {
  detectBundler,
  detectFramework,
  detectHttpClient,
  detectTranslations,
  detectMinifier,
  detectModules,
  detectStylingLibraries,
  detectStylingProcessor,
  detectTranspiler,
  detectUILibrary,
  getStats,
  detectStateManagement,
  detectDatesLibrary,
  detectRouter,
} from './features/index.js';

export const analyze = async (
  url: string,
  page: Page,
  browser: Browser,
  handleProgress: OnProgress
) => {
  const startedAt = new Date();
  // TODO: Resources to function
  const resources = new Resources(page);
  await resources.initialize();

  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 15000,
  });

  const onProgress = createProgressTracker(url, handleProgress, startedAt, 10);
  const bundler = await detectBundler(page, browser, resources);
  onProgress({ bundler });
  const transpiler = await detectTranspiler(page, browser, resources);
  onProgress({ transpiler });
  const framework = await detectFramework(page, browser, resources);
  onProgress({ framework });
  const minifier = await detectMinifier(page, browser, resources);
  onProgress({ minifier });
  const stylingProcessor = await detectStylingProcessor(
    page,
    browser,
    resources
  );
  onProgress({ stylingProcessor });
  const modules = await detectModules(page, browser, resources);
  onProgress({ modules });
  const uiLibrary = await detectUILibrary(page, browser, resources);
  onProgress({ uiLibrary });
  const httpClient = await detectHttpClient(page, browser, resources);
  onProgress({ httpClient });
  const stateManagement = await detectStateManagement(page, browser, resources);
  onProgress({ stateManagement });
  const dates = await detectDatesLibrary(page, browser, resources);
  onProgress({ dates });
  const router = await detectRouter(page, browser, resources);
  onProgress({ router });
  const stylingLibraries = await detectStylingLibraries(
    page,
    browser,
    resources
  );
  onProgress({ stylingLibraries });

  const translations = await detectTranslations(page, browser, resources);
  onProgress({ translations });

  const stats = await getStats(page);
  onProgress({ stats });

  const finishedAt = new Date();
  const duration = finishedAt.getTime() - startedAt.getTime();

  return {
    url,
    timestamp: finishedAt.toISOString(),
    duration,
    analysis: {
      bundler,
      transpiler,
      framework,
      minifier,
      stylingProcessor,
      modules,
      router,
      dates,
      translations,
      stateManagement,
      uiLibrary,
      httpClient,
      stylingLibraries,
      stats,
    },
  };
};

export type AnalyzeResult = Awaited<ReturnType<typeof analyze>>;
