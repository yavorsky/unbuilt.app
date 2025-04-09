import { Page, Request, Response } from 'playwright';
import { Resource, ResourcesMap, ResourceType, ScriptsMap } from './types.js';
import { initZstd } from './decoders/zstd.js';

export class Resources {
  private page: Page;
  private cache: Map<string, string> = new Map();
  private resourcesMap: ResourcesMap = new Map();
  private scriptsMap: ScriptsMap = new Map();
  private stylesheetsMap: ScriptsMap = new Map();
  private documentsMap: ScriptsMap = new Map();
  private onError?: (error: Error) => void;
  constructor(page: Page) {
    this.page = page;
  }

  async initialize(onError?: (error: Error) => void) {
    this.onError = onError;
    await this.page.route('**/*', async (route) => {
      let resourceType: string;
      let request: Request;

      try {
        request = route.request();
        resourceType = request.resourceType();
      } catch (error) {
        onError?.(error as Error);
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
          const headers = response.headers();

          const contentEncoding = headers['content-encoding'] || '';
          // Playwright doesn't decode zstd encoding, so we need to manually decode it.
          if (contentEncoding.includes('zstd')) {
            const zstdDecoder = await initZstd();
            const buffer = await response.body();
            const uint8Array = new Uint8Array(buffer);
            const decompressedArray = zstdDecoder.decompress(uint8Array);
            const decoder = new TextDecoder('utf-8');
            content = decoder.decode(decompressedArray);
          } else {
            content = await response.text();
          }
        } catch (error) {
          onError?.(error as Error);
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
      this.onError?.(error as Error);
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
        console.log(resource.url, content);
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
      this.onError?.(error as Error);
      // Even if there's an error, try to clear maps to prevent memory leaks
      this.clearAllMaps();
    }
  }
}
