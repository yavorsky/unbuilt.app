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
      /__remixContext\.state/,
      /__remixContext\.url/,
      /__remixContext\.matches/,
      /__remixContext\.routeData/,
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
    name: 'chunks' as const,
    score: 0.8,
    filenames: [/remix\.config\./, /remix\.init\./],
  },
];
