import { Page } from 'playwright';

export const got = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core imports and instances
      /["']got["']/,
      /import\s+got\s+from/,
      /require\s*\(\s*["']got["']\)/,
      /got\.extend\s*\(/,

      // HTTP methods
      /got\s*\(/,
      /got\.(?:get|post|put|patch|delete|head)\s*\(/,
      /got\.stream\s*\(/,
      /got\.paginate\s*\(/,

      // Core configurations
      /prefixUrl:/,
      /responseType:/,
      /resolveBodyOnly:/,
      /isStream:/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for got instance
          hasGot: typeof window.got === 'function' && 'extend' in window.got,

          // Check for extended instances
          hasExtended: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'function' &&
              'extend' in obj &&
              'stream' in obj &&
              'paginate' in obj
          ),

          // Check for got defaults
          hasDefaults: !!window.got?.defaults,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Common configurations
      /timeout:\s*\{/,
      /retry:\s*\{/,
      /searchParams:/,
      /pagination:/,

      // Hook patterns
      /beforeRequest:/,
      /afterResponse:/,
      /beforeRetry:/,
      /beforeError:/,

      // Error handling
      /HTTPError\b/,
      /TimeoutError\b/,
      /RequestError\b/,
      /CacheError\b/,
      /ParseError\b/,

      // Advanced features
      /context:/,
      /handlers:/,
      /mutableDefaults:/,
      /cache:/,
      /dnsCache:/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Library files
      /got(?:\.min)?\.js$/i,
      /node_modules\/got\//i,
      /got-\w+\.js$/i,

      // Common integration patterns
      /api(?:-)?client\.js$/i,
      /http(?:-)?client\.js$/i,
      /got(?:-)?instance\.js$/i,

      // Common project patterns
      /services\/api/i,
      /utils\/http/i,
      /lib\/got/i,

      // Build outputs
      /\bgot\.[a-f0-9]+\.js$/i,
      /\bapi\.[a-f0-9]+\.js$/i,
      /\bhttp\.[a-f0-9]+\.js$/i,
    ],
  },
];
