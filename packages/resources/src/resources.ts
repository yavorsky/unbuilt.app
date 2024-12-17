import { Page } from 'playwright';
import {
  Resource,
  ResourceAnalysis,
  ResourcesMap,
  ResourceType,
  ScriptsMap,
} from './types.js';

export class Resources {
  private page: Page;
  private cache: Map<string, string> = new Map();
  private resourcesMap: ResourcesMap = new Map();
  private scriptsMap: ScriptsMap = new Map();
  constructor(page: Page) {
    this.page = page;
  }

  async initialize() {
    await this.page.route('**/*', async (route) => {
      const request = route.request();
      const resourceType = request.resourceType();

      let content = null;
      // Intercept JS content
      if (resourceType === 'script') {
        const response = await route.fetch();
        content = await response.text();
      }
      this.set(
        {
          url: request.url(),
          size: 0,
          timing: Date.now(),
          type: resourceType as ResourceType,
        },
        content
      );

      await route.continue();
    });

    // Setup response handling
    this.page.on('response', async (response) => {
      const request = response.request();
      const url = request.url();

      if (this.has(url)) {
        const resource = this.get(url);
        if (!resource) {
          return;
        }
        if (resource.size > 0 && resource.status) {
          this.set({
            ...resource,
            size: (await response.body()).length,
            status: response.status(),
            timing: Date.now() - resource.timing,
          });
        }
      }
    });
  }

  set(resource: Resource, content?: string | null) {
    this.resourcesMap.set(resource.url, {
      type: resource.type,
      url: resource.url,
      size: resource.size ?? 0,
      status: resource.status ?? 0,
      timing: resource.timing ?? Date.now(),
    });

    if (content) {
      this.scriptsMap.set(resource.url, content);
    }
  }

  has(url: string) {
    return this.resourcesMap.has(url);
  }

  get(url: string) {
    return this.resourcesMap.get(url);
  }

  getAll() {
    return this.resourcesMap.values();
  }

  getScript(url: string) {
    return this.scriptsMap.get(url);
  }

  hasScript(url: string) {
    return this.scriptsMap.has(url);
  }

  getAllScripts() {
    return this.scriptsMap.values();
  }

  getAllScriptsNames() {
    return this.scriptsMap.keys();
  }

  getAllScriptsContent() {
    const cached = this.cache.get('allScriptsContent');
    if (typeof cached === 'string') {
      return cached;
    }
    const result = Array.from(this.getAllScripts()).join('\n');
    this.cache.set('allScriptsContent', result);
    return result;
  }

  async analyze(): Promise<ResourceAnalysis> {
    const resources = Array.from(this.resourcesMap.values());

    const jsResources = resources.filter((r) => r.type === 'script');
    const cssResources = resources.filter((r) => r.type === 'stylesheet');
    const imageResources = resources.filter((r) => r.type === 'image');
    const fontResources = resources.filter((r) => r.type === 'font');

    return {
      js: {
        count: jsResources.length,
        size: jsResources.reduce((sum, r) => sum + r.size, 0),
        external: jsResources.filter((r) => !r.url.includes(this.page!.url()))
          .length,
        inline: await this.countInlineScripts(),
      },
      css: {
        count: cssResources.length,
        size: cssResources.reduce((sum, r) => sum + r.size, 0),
        external: cssResources.filter((r) => !r.url.includes(this.page!.url()))
          .length,
        inline: await this.countInlineStyles(),
      },
      images: {
        count: imageResources.length,
        size: imageResources.reduce((sum, r) => sum + r.size, 0),
        optimized: await this.countOptimizedImages(),
      },
      fonts: {
        count: fontResources.length,
        size: fontResources.reduce((sum, r) => sum + r.size, 0),
        preloaded: await this.countPreloadedFonts(),
      },
    };
  }

  calculateConfidence(patterns: string[]): number {
    let matches = 0;
    const scriptsArr = Array.from(this.scriptsMap.keys());

    for (const pattern of patterns) {
      for (const script of scriptsArr) {
        if (script.includes(pattern)) {
          matches++;
          break;
        }
      }
    }

    return matches / patterns.length;
  }

  private async countInlineScripts(): Promise<number> {
    return this.page!.evaluate(
      () => document.querySelectorAll('script:not([src])').length
    );
  }

  private async countInlineStyles(): Promise<number> {
    return this.page!.evaluate(() => document.querySelectorAll('style').length);
  }

  private async countOptimizedImages(): Promise<number> {
    return this.page!.evaluate(
      () =>
        document.querySelectorAll(
          'img[srcset], img[loading="lazy"], picture source'
        ).length
    );
  }

  private async countPreloadedFonts(): Promise<number> {
    return this.page!.evaluate(
      () => document.querySelectorAll('link[rel="preload"][as="font"]').length
    );
  }
}
