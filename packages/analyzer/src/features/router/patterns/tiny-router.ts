import { Page } from 'playwright';

declare global {
  interface Window {
    __TINY_ROUTER__?: unknown;
    tinyRouter?: unknown;
  }
}

export const tinyRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core imports and initialization
      /["']@tinyhttp\/router["']/,
      /["']tinyhttp["']/,
      /new\s+Router\s*\(/,
      /createRouter\s*\(/,

      // Core HTTP method patterns
      /\.(?:get|post|put|patch|delete)\s*\(['"][^'"]+["']/,
      /\.all\s*\(['"][^'"]+["']/,
      /\.use\s*\(['"][^'"]+["']/,

      // Route parameter patterns
      /:\w+/, // Named parameters
      /\*\w*/, // Wildcards
      /\(\.\*\)/, // RegExp wildcards
      /\(\?:/, // Non-capturing groups

      // Middleware and handler patterns
      /\.use\s*\([^)]*\)/,
      /\.handle\s*\([^)]*\)/,
      /next\s*\(\)/,
      /next\s*\(null\)/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for global router instance
          hasRouter: !!window.__TINY_ROUTER__ || !!window.tinyRouter,

          // Check for router instance methods
          hasInstance: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              'handle' in obj &&
              'use' in obj &&
              'get' in obj &&
              'post' in obj
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
      // Route patterns
      /path:\s*["'][^'"]+["']/,
      /method:\s*["'](GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)["']/,
      /params:\s*\{/,

      // Middleware patterns
      /\(\s*req\s*,\s*res\s*,\s*next\s*\)\s*=>/,
      /function\s*\(\s*req\s*,\s*res\s*,\s*next\s*\)/,
      /async\s*\(\s*req\s*,\s*res\s*,\s*next\s*\)/,

      // Error handling
      /\.catch\s*\(/,
      /\.onerror\s*=/,
      /\.on\s*\(\s*["']error["']/,

      // Common patterns in handlers
      /req\.params\./,
      /req\.query\./,
      /res\.send\s*\(/,
      /res\.json\s*\(/,
      /res\.status\s*\(/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Library files
      /tiny-router(?:\.min)?\.js$/i,
      /@tinyhttp\/router/i,
      /tinyhttp[/\\]router/i,

      // Common project patterns
      /router\.[jt]s$/i,
      /routes?\.[jt]s$/i,
      /router\/index\.[jt]s$/i,

      // Common middleware and route files
      /middleware\//i,
      /handlers\//i,
      /controllers\//i,

      // Build output patterns
      /\brouter\.[a-f0-9]+\.js$/i,
      /\broutes\.[a-f0-9]+\.js$/i,
      /tiny\.[a-f0-9]+\.js$/i,
    ],
  },
];
