import { Page } from 'playwright';

export const remix = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      // Core Remix globals and identifiers
      /__remixContext/,
      /__remixManifest/,
      /__remixRouteModules/,
      /__remix_entry__/,
      /isOutsideRemixApp:/,
      /💿 Hey developer 👋.*remix\.run\/guides\/errors/,
      /remix\.run\/route\/meta/,
      /Unknown @remix-run\/router error/,
      /["']remix-router-transitions["']/,
      /You are trying to use a blocker on a POP navigation.*@remix-run\/router/,
      /All route meta functions must return an array of meta objects/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.9,
    scripts: [
      // Remix-specific DOM attributes and markers
      /data-remix-run/,
      /data-remix-/,
      /remix-pending/,
      /remix-state/,
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.8,
    scripts: [
      // Remix-specific hydration markers
      /when your app is loading JS modules.*clientLoader.*remix\.run\/route\/hydrate-fallback/,
      /dangerouslySetInnerHTML:.*💿 Hey developer/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Core Remix globals
          hasRemixContext: typeof window.__remixContext !== 'undefined',
          hasRemixManifest: typeof window.__remixManifest !== 'undefined',
          hasRemixRouteModules:
            typeof window.__remixRouteModules !== 'undefined',

          // DOM markers
          hasRemixDataElements: !!document.querySelector('[data-remix-run]'),
          hasRemixStateElements: !!document.querySelector('[data-remix-state]'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'headers' as const,
    score: 1,
    headers: {
      'X-Remix-Reload-Document': /.+/i,
      'X-Remix-Replace': /.+/i,
      'X-Remix-Revalidate': /.+/i,
      'X-Remix-Response': /.+/i,
    },
  },
];
