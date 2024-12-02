import { Page } from 'playwright';
import { Resources } from '../resources.js';

export interface PerformanceFeatures {
  resourceCount: number;
  totalSize: number;
  scriptMetrics: {
    async: number;
    defer: number;
    modules: number;
  };
  imageMetrics: {
    lazyLoaded: number;
    total: number;
  };
}

export class PerformanceFeaturesDetector {
  private page: Page;
  private resources: Resources;
  constructor(page: Page, resources: Resources) {
    this.page = page;
    this.resources = resources;
  }

  async detect(): Promise<PerformanceFeatures> {
    const performanceMetrics = await this.page!.evaluate(() => {
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
    return performanceMetrics;
  }
}
