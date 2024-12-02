import { Page } from 'playwright';

export const stats = async (page: Page) => {
  const resourceMetrics = await page!.evaluate(() => {
    const resources = performance.getEntriesByType('resource');

    return {
      resourceCount: resources.length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
