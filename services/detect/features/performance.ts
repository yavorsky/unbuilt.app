import { Page } from "playwright";
import { Resources } from "../resources";

export interface PerformanceFeatures {
  bundler: {
    name: string;
    confidence: number;
  };
  transpiler: {
    name: string;
    confidence: number;
  };
  minifier: {
    name: string;
    confidence: number;
  };
  optimization: {
    codeModularity: boolean;
    treeShaking: boolean;
    codeSplitting: boolean;
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

    const response = await this.page!.goto(this.page!.url());
    const headers = response?.headers() || {};

    return {
      lazyLoading: {
        images: performanceMetrics.imageMetrics.lazyLoaded > 0,
        modules: performanceMetrics.scriptMetrics.modules > 0,
        components: await this.detectLazyComponents(),
      },
      caching: {
        hasCache: !!headers['cache-control'],
        hasETag: !!headers['etag'],
        hasServiceWorker: await this.detectServiceWorker(),
      },
      compression: {
        gzip: headers['content-encoding']?.includes('gzip') || false,
        brotli: headers['content-encoding']?.includes('br') || false,
      },
      optimization: {
        totalResources: performanceMetrics.resourceCount,
        totalSize: performanceMetrics.totalSize,
        deferredScripts: performanceMetrics.scriptMetrics.defer,
        asyncScripts: performanceMetrics.scriptMetrics.async,
      },
    };
  }

  private async detectLazyComponents(): Promise<boolean> {
    const dynamicImports = Array.from(this.scripts).some((script) => script.includes('import('));

    const reactLazy = Array.from(this.scripts).some(
      (script) => script.includes('React.lazy') || script.includes('lazy(')
    );

    const vueLazy = Array.from(this.scripts).some(
      (script) => script.includes('() => import(') || script.includes('defineAsyncComponent')
    );

    return dynamicImports || reactLazy || vueLazy;
  }

  private async detectServiceWorker(): Promise<boolean> {
    return this.page!.evaluate(
      () =>
        !!navigator.serviceWorker?.controller ||
        !!document.querySelector('script[src*="service-worker"]')
    );
  }
}