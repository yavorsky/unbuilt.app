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
  private stylesheetsMap: ScriptsMap = new Map();
  private documentsMap: ScriptsMap = new Map();
  constructor(page: Page) {
    this.page = page;
  }

  async initialize() {
    await this.page.route('**/*', async (route) => {
      const request = route.request();
      const resourceType = request.resourceType();

      let content = null;
      // Intercept JS content
      if (
        resourceType === 'script' ||
        resourceType === 'stylesheet' ||
        resourceType === 'document'
      ) {
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
      if (resource.type === 'script') {
        this.scriptsMap.set(resource.url, content);
        return;
      }
      if (resource.type === 'stylesheet') {
        this.stylesheetsMap.set(resource.url, content);
        return;
      }
      if (resource.type === 'document') {
        this.documentsMap.set(resource.url, content);
        return;
      }
      console.warn('Unknown resource type', resource.type);
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

  getAllStylesheets() {
    return this.stylesheetsMap.values();
  }

  getAllDocuments() {
    return this.documentsMap.values();
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

  getAllStylesheetsContent() {
    const cached = this.cache.get('allStylesheetsContent');
    if (typeof cached === 'string') {
      return cached;
    }
    const result = Array.from(this.getAllStylesheets()).join('\n');
    this.cache.set('allStylesheetsContent', result);
    return result;
  }

  getAllDocumentsContent() {
    const cached = this.cache.get('allDocumentsContent');
    if (typeof cached === 'string') {
      return cached;
    }
    const result = Array.from(this.getAllDocuments()).join('\n');
    this.cache.set('allDocumentsContent', result);
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
