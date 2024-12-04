import { Page } from 'playwright';

export const fetch = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core fetch calls
      /fetch\s*\([^)]*\)/,
      /window\.fetch\s*\(/,
      /globalThis\.fetch\s*\(/,
      /self\.fetch\s*\(/,

      // Request/Response constructor patterns
      /new\s+Request\s*\(/,
      /new\s+Response\s*\(/,
      /new\s+Headers\s*\(/,

      // Response method chains
      /\.(?:json|text|blob|formData|arrayBuffer)\s*\(\s*\)/,
      /\.ok\b/,
      /\.status\b/,
      /\.statusText\b/,

      // Common fetch options
      /method:\s*["'](GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)["']/,
      /credentials:\s*["'](include|same-origin|omit)["']/,
      /mode:\s*["'](cors|no-cors|same-origin)["']/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const globals = [window, globalThis, self];
        const markers = {
          // Check for native fetch API
          hasFetch: globals.some((g) => typeof g.fetch === 'function'),

          // Check for standard objects
          hasRequest: typeof Request === 'function',
          hasResponse: typeof Response === 'function',
          hasHeaders: typeof Headers === 'function',

          // Check for polyfills
          hasPolyfill: globals.some(
            (g) =>
              // @ts-expect-error - TS doesn't know about polyfill properties
              (g.fetch && g.fetch.polyfill) ||
              g.fetch.toString().includes('[native code]') === false
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Common header patterns
      /headers:\s*\{[^}]*'?[Cc]ontent-[Tt]ype'?:/,
      /headers:\s*\{[^}]*'?[Aa]uthorization'?:/,
      /headers\.(?:append|set|get|has|delete)\s*\(/,

      // Body handling
      /body:\s*JSON\.stringify\s*\(/,
      /body:\s*formData/i,
      /body:\s*new\s+FormData/,
      /body:\s*new\s+URLSearchParams/,

      // Error handling patterns
      /if\s*\(\s*!response\.ok\s*\)/,
      /throw\s+new\s+Error\s*\(\s*response\.statusText\s*\)/,
      /fetch.*\.catch\s*\(/,

      // Common utility patterns
      /AbortController/,
      /signal:/,
      /cache:/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Polyfill files
      /fetch-polyfill/i,
      /whatwg-fetch/i,
      /unfetch/i,
      /isomorphic-fetch/i,

      // Common API file patterns
      /api(?:-)?client\.js$/i,
      /http(?:-)?client\.js$/i,
      /fetch(?:-)?service\.js$/i,
      /fetch(?:-)?wrapper\.js$/i,

      // Common build patterns
      /\bfetch\.[a-f0-9]+\.js$/i,
      /\bapi\.[a-f0-9]+\.js$/i,
      /\bhttp\.[a-f0-9]+\.js$/i,
    ],
  },
];
