import { Browser, Page } from 'playwright';
import { Resources } from './resources.js';

export const stats = async (page: Page) => {

  const resourceMetrics = await page!.evaluate(() => {
    const resources = performance.getEntriesByType('resource');

    return {
      resourceCount: resources.length,
      // TODO: Use PerformanceObserver
      // eslint-disable-next-line
      totalSize: resources.reduce((sum, r) => sum + (r as any).transferSize, 0),
      scriptMetrics: {
        async: document.querySelectorAll('script[async]').length,
        defer: document.querySelectorAll('script[defer]').length,
        modules: document.querySelectorAll('script[type="module"]').length,
      },
      imageMetrics: {
        lazyLoaded: document.querySelectorAll('img[loading="lazy"]').length,
        total: document.querySelectorAll('img').length,
      },
    };
  });

  return resourceMetrics;
};
