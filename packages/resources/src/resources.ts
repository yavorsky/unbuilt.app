import { Page, Request, Response } from 'playwright';
import {
  HeadersMap,
  Resource,
  ResourcesMap,
  ResourceType,
  ScriptsMap,
} from './types.js';
import { initZstd } from './decoders/zstd.js';
import { normalizeHeaders } from './utils.js';

export class Resources {
  private page: Page;
  private cache: Map<string, string> = new Map();
  private resourcesMap: ResourcesMap = new Map();
  private scriptsMap: ScriptsMap = new Map();
  private stylesheetsMap: ScriptsMap = new Map();
  private documentsMap: ScriptsMap = new Map();
  private headersMap: Map<string, HeadersMap> = new Map();
  private onError?: (error: Error) => void;
  constructor(page: Page) {
    this.page = page;
  }

  async initialize(onError?: (error: Error) => void) {
    this.onError = onError;
    await this.page.route('**/*', async (route) => {
      let resourceType: string;
      let request: Request;
      let requestHeaders: Record<string, string> = {};

      try {
        request = route.request();
        resourceType = request.resourceType();
      } catch (error) {
        onError?.(error as Error);
        await route.continue();
        return;
      }

      const url = request.url();

      try {
        requestHeaders = request.headers();
      } catch (error) {
        onError?.(error as Error);
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

          this.setHeaders(url, headers);

          const contentEncoding = headers['content-encoding'] || '';
          // Playwright doesn't decode zstd encoding, so we need to manually decode it.
          if (contentEncoding.includes('zstd')) {
            try {
              const zstdDecoder = await initZstd();
              const buffer = await response.body();
              const uint8Array = new Uint8Array(buffer);
              const decompressedArray = zstdDecoder.decompress(uint8Array);
              const decoder = new TextDecoder('utf-8');
              content = decoder.decode(decompressedArray);
            } catch (error) {
              onError?.(error as Error);
            }
          } else {
            content = await response.text();
          }
        } catch (error) {
          onError?.(error as Error);
          await route.abort();
          return;
        }
      }

      // Save the resource with headers
      this.set(
        {
          url,
          size: 0,
          timing: Date.now(),
          type: resourceType as ResourceType,
          headers: requestHeaders,
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
    let requestHeaders: Record<string, string> = {};
    let request: Request;

    try {
      request = response.request();
      url = request.url();
    } catch (error) {
      this.onError?.(error as Error);
      return;
    }

    try {
      requestHeaders = request.headers(); // Get the request headers
    } catch (error) {
      this.onError?.(error as Error);
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
          headers: requestHeaders, // Include the headers in the updated resource
        });
      }
    }
  };

  // New method to set headers
  setHeaders(url: string, headers: Record<string, string>) {
    this.headersMap.set(url, normalizeHeaders(headers));
  }

  // New method to get headers
  getHeaders(url: string) {
    return this.headersMap.get(url);
  }

  // New method to get all headers
  getAllHeaders() {
    const allHeaders: Map<string, string> = new Map();

    this.headersMap.forEach((headersObj, _url) => {
      // Add each header to the flattened map
      Object.entries(headersObj).forEach(([headerName, headerValue]) => {
        if (allHeaders.has(headerName)) {
          allHeaders.set(
            headerName,
            // Concatinate multiple headers with the same name.
            allHeaders.get(headerName) + ', ' + headerValue
          );
        } else {
          allHeaders.set(headerName, headerValue);
        }
      });
    });

    return allHeaders;
  }

  set(resource: Resource, content?: string | null) {
    this.resourcesMap.set(resource.url, {
      type: resource.type,
      url: resource.url,
      size: resource.size ?? 0,
      status: resource.status ?? 0,
      timing: resource.timing ?? Date.now(),
      headers: resource.headers ?? {}, // Include headers in the resource map
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
    this.resourcesMap?.clear();
    this.scriptsMap?.clear();
    this.stylesheetsMap?.clear();
    this.documentsMap?.clear();
    this.headersMap?.clear(); // Clear the headers map
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
