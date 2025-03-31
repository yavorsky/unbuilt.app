import { Page } from 'playwright';

export const tanstackRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.6,
    scripts: [
      // Core package imports (including minified variants)
      /["']@t(?:anstack)?[/\\-]router(?:-(?:core|devtools))?["']/,

      // Internal markers unique to TanStack
      /__TANSTACK_ROUTER_(?:STATE|HISTORY|DEVTOOLS)__/,
      /\$TSR_ROUTER\$/,
      /\$TS_ROUTER\$/,

      // Unique route masks pattern
      /routeMasks.*find.*No.*basepath.*pathname.*caseSensitive:/,

      // Unique warning for deprecated API with exact URL
      /notFoundRoute.*tanstack\.com\/router\/v1\/docs\/framework\/react\/guide\/not-found-errors/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 1.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for TanStack-specific globals
          hasTanStackMarkers:
            !!window.__TSR_ROUTER__ ||
            !!window.__TANSTACK_ROUTER_STATE__ ||
            !!window.__TANSTACK_ROUTER_HISTORY__ ||
            !!window.__TANSTACK_ROUTER_DEVTOOLS__,

          // Check for TanStack Router specific exports and properties
          hasContext: !!window.__TSR_ROUTER_CONTEXT__,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'ssr' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.__TSR_SSR__ || !!window.__TANSTACK_ROUTER_SSR__;
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.4,
    scripts: [
      // TanStack-specific route definitions (minification resistant)
      /createFileRoute\s*\(\s*['"][/\w]+['"]\s*,?\s*\{/,
      /createLazyFileRoute\s*\(\s*['"][/\w]+['"]\s*,?\s*\{/,
    ],
  },
];
