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

export const analyze = async (url: string, page: Page, browser: Browser) => {
  const startedAt = new Date();

  // TODO: Resources to function
  const resources = new Resources(page);
  await resources.initialize();

  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 15000,
  });

  const bundler = await detectBundler(page, browser, resources);
  const transpiler = await detectTranspiler(page, browser, resources);
  const framework = await detectFramework(page, browser, resources);
  const minifier = await detectMinifier(page, browser, resources);
  const stylingProcessor = await detectStylingProcessor(
    page,
    browser,
    resources
  );
  const modules = await detectModules(page, browser, resources);
  const uiLibrary = await detectUILibrary(page, browser, resources);
  const jsLibraries = await detectJSLibraries(page, browser, resources);
  const stylingLibraries = await detectStylingLibraries(
    page,
    browser,
    resources
  );

  const stats = await getStats(page);

  const finishedAt = new Date();
  const duration = finishedAt.getTime() - startedAt.getTime();

  return {
    url,
    timestamp: finishedAt.toISOString(),
    duration,
    result: {
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
