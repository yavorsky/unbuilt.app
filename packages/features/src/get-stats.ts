import { Page } from 'playwright';
import { Stats } from './types/stats.js';

// Types for the enhanced stats
interface ResourceTypeMetrics {
  count: number;
  totalSize: number;
}

export const getStats = async (page: Page): Promise<Stats> => {
  const resourceMetrics = await page!.evaluate(() => {
    const getResourceTypeMetrics = (
      resources: PerformanceResourceTiming[],
      type: string
    ): ResourceTypeMetrics => {
      const typeResources = resources.filter((r) => r.initiatorType === type);

      return {
        count: typeResources.length,
        totalSize: typeResources.reduce((sum, r) => sum + r.encodedBodySize, 0),
      };
    };

    // Function to calculate DOM depth
    const getMaxDepth = (element: Element): number => {
      let maxChildDepth = 0;
      for (const child of element.children) {
        maxChildDepth = Math.max(maxChildDepth, getMaxDepth(child));
      }
      return 1 + maxChildDepth;
    };

    const getNodeSize = (node: Node): number => {
      const serializer = new XMLSerializer();
      return new Blob([serializer.serializeToString(node)]).size;
    };

    const resources = performance.getEntriesByType(
      'resource'
    ) as PerformanceResourceTiming[];
    const scripts = document.querySelectorAll('script');
    const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');

    return {
      resourceCount: resources.length,

      totalSize: resources.reduce((sum, r) => sum + r.encodedBodySize, 0),
      scriptMetrics: {
        async: document.querySelectorAll('script[async]').length,
        defer: document.querySelectorAll('script[defer]').length,
        modules: document.querySelectorAll('script[type="module"]').length,
        inline: Array.from(scripts).filter((s) => !s.src).length,
        crossOrigin: document.querySelectorAll('script[crossorigin]').length,
        preload: document.querySelectorAll('link[rel="preload"][as="script"]')
          .length,
        totalSize: getResourceTypeMetrics(resources, 'script').totalSize,
      },
      styleMetrics: {
        total: styleLinks.length,
        inline: document.querySelectorAll('style').length,
        preload: document.querySelectorAll('link[rel="preload"][as="style"]')
          .length,
        modules: document.querySelectorAll('link[rel="modulepreload"]').length,
        totalSize: getResourceTypeMetrics(resources, 'style').totalSize,
      },
      imageMetrics: {
        lazyLoaded: document.querySelectorAll('img[loading="lazy"]').length,
        total: document.querySelectorAll('img').length,
        totalSize: getResourceTypeMetrics(resources, 'img').totalSize,
      },
      domMetrics: {
        totalNodes: document.getElementsByTagName('*').length,
        maxDepth: getMaxDepth(document.documentElement),
        totalSize: getNodeSize(document),
      },
    };
  });

  return resourceMetrics;
};
