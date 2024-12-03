import { Browser, Page } from 'playwright';
import { detect as detectBundler } from './features/bundler/detect.js';
import { detect as detectFramework } from './features/framework/detect.js';
import { detect as detectMinifier } from './features/minifier/detect.js';
import { detect as detectStylingProcessor } from './features/styling-processor/detect.js';
import { detect as detectModules } from './features/module/detect.js';
import { detect as detectUILibrary } from './features/ui-library/detect.js';
import { detect as detectJSLibraries } from './features/js-libraries/detect.js';
import { detect as detectStylingLibraries } from './features/styling-libraries/detect.js';
import { detect as detectTranspiler } from './features/transpiler/detect.js';
import { Resources } from './resources.js';
import { getStats } from './features/stats.js';
import { createProgressTracker, OnProgress } from './progress.js';

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
  const jsLibraries = await detectJSLibraries(page, browser, resources);
  onProgress({ jsLibraries });
  const stylingLibraries = await detectStylingLibraries(
    page,
    browser,
    resources
  );
  onProgress({ stylingLibraries });

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
      uiLibrary,
      jsLibraries,
      stylingLibraries,
      stats,
    },
  };
};

export type AnalyzeResult = Awaited<ReturnType<typeof analyze>>;
