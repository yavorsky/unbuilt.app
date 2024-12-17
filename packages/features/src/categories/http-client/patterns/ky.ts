import { Page } from 'playwright';

export const ky = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core imports and instances
      /["']ky["']/,
      /["']ky-universal["']/,
      /ky\.create\(/,
      /ky\.extend\(/,

      // HTTP methods with ky's unique chaining
      /ky(?:\.default)?\.(?:get|post|put|patch|delete|head)\s*\([^)]*\)\.(?:json|text|blob|arrayBuffer|formData)\s*\(/,
      /ky\s*\([^)]*\)\.(?:json|text|blob|arrayBuffer|formData)\s*\(/,

      // Ky-specific options
      /prefixUrl:/,
      /retry:\s*(?:\d+|\{)/,
      /throwHttpErrors:/,
      /searchParams:/,
      /credentials:/,
      /hooks:/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for global ky
          hasKy: typeof window.ky === 'function' && 'extend' in window.ky,

          // Check for extended instances
          hasExtended: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'function' &&
              'extend' in obj &&
              'create' in obj
          ),

          // Check for ky's modifications to fetch
          hasFetchExtensions:
            typeof window.fetch === 'function' &&
            window.fetch.toString().includes('ky'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Hook patterns
      /beforeRequest:\s*\[/,
      /afterResponse:\s*\[/,
      /beforeRetry:\s*\[/,
      /beforeError:\s*\[/,

      // Response type handling
      /\.json\s*\(\s*\{/,
      /\.text\s*\(\s*\{/,
      /\.blob\s*\(\s*\{/,
      /\.arrayBuffer\s*\(\s*\{/,
      /\.formData\s*\(\s*\{/,

      // Error handling patterns
      /HTTPError\b/,
      /TimeoutError\b/,
      /if\s*\(\s*error instanceof HTTPError\s*\)/,

      // Common configurations
      /timeout:\s*\d+/,
      /retry:\s*\{[^}]*\}/,
      /onDownloadProgress:/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Library files
      /ky(?:\.min)?\.js$/i,
      /ky-universal/i,
      /node_modules\/ky\//i,

      // Common integration patterns
      /api(?:-)?client\.js$/i,
      /http(?:-)?client\.js$/i,
      /ky(?:-)?instance\.js$/i,
      /ky(?:-)?config\.js$/i,

      // Build output patterns
      /\bky\.[a-f0-9]+\.js$/i,
      /\bapi\.[a-f0-9]+\.js$/i,
      /\bhttp\.[a-f0-9]+\.js$/i,

      // Common project patterns
      /services\/api/i,
      /utils\/http/i,
      /lib\/ky/i,
    ],
  },
];
