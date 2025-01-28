import { Page, Request, Response } from 'playwright';
import { Resource, ResourcesMap, ResourceType, ScriptsMap } from './types.js';

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
      let resourceType: string;
      let request: Request;
      try {
        request = route.request();
        resourceType = request.resourceType();
      } catch (error) {
        console.error('[Page request **/*]', error);
        await route.continue();
        return;
      }

      let content = null;
      // Intercept JS content
      if (
        resourceType === 'script' ||
        resourceType === 'stylesheet' ||
        resourceType === 'document'
      ) {
        try {
          const response = await route.fetch();
          content = await response.text();
        } catch (error) {
          console.error('[Page route **/*]', error);
          await route.abort();
          return;
        }
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
    this.page.on('response', this.handleResponse);
  }

  handleResponse = async (response: Response) => {
    let url: string;
    try {
      const request = response.request();
      url = request.url();
    } catch (error) {
      console.error('[Page response]', error);
      return;
    }

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
  };

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

  private clearAllMaps() {
    // Clear all resource maps and cache
    this.resourcesMap?.clear();
    this.scriptsMap?.clear();
    this.stylesheetsMap?.clear();
    this.documentsMap?.clear();
    this.cache?.clear();
  }

  async cleanup() {
    try {
      // Remove the route handler
      await this.page.unroute('**/*');

      // Remove response event listener
      await this.page.removeListener('response', this.handleResponse);

      const client = await this.page.context().newCDPSession(this.page);
      await client.send('Network.clearBrowserCache');
      await client.send('Network.clearBrowserCookies');
      await client.detach();

      // Clear all maps using the extracted method
      this.clearAllMaps();

      // Clear any circular references
      if (this.page) {
        // @ts-expect-error - Clear the reference to allow garbage collection
        this.page = null;
      }

      // Force garbage collection if available in the environment
      if (global.gc) {
        global.gc();
      }
    } catch (error) {
      console.error('[Resources] Error during cleanup:', error);
      // Even if there's an error, try to clear maps to prevent memory leaks
      this.clearAllMaps();
    }
  }
}
