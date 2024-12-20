import { Page } from 'playwright';

export const svelteRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // SvelteKit Router specific imports (minification resistant)
      /["']@sveltejs\/kit(?:\/navigation|\/routing|\/runtime\/client)["']/,
      /["']sveltejs\/kit(?:\/package\.json|\/client\.js)["']/,

      // SvelteKit's internal markers (survive minification)
      /__SVELTEKIT_[A-Z_]+__/,
      /__sveltekit_[a-z_]+__/,
      /\$app\/(?:navigation|stores|environment)/,
      /\[Symbol\.for\(["']sveltekit-routing["']\)\]/,

      // SvelteKit Router specific initializers (minification resistant)
      /initializeClientNavigation\(/,
      /handleNavigate\(\{from:/,
      /setupNavigationListeners\(/,
      /disableScrollHandling\(/,

      // Svelte stores and navigation (survive minification)
      /navigating\.subscribe\(/,
      /\$beforeNavigate/,
      /\$afterNavigate/,
      /invalidate\(["'][^"']+["']\)/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for SvelteKit specific globals
          hasSvelteKitMarkers: !!(
            window.__SVELTEKIT__ ||
            window.__sveltekit_spa__ ||
            window.__sveltekit_hydrate__ ||
            window.__SVELTEKIT_EMBEDDED__
          ),

          // Check for SvelteKit Router specific instance properties
          hasSvelteKitInstance: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              // Router instance with SvelteKit-specific properties
              (('navigation' in obj && 'renderer' in obj && 'version' in obj) ||
                // Navigation store with SvelteKit-specific structure
                ('from' in obj &&
                  'to' in obj &&
                  'type' in obj &&
                  'complete' in obj) ||
                // Page store with SvelteKit-specific data
                ('url' in obj &&
                  'params' in obj &&
                  'route' in obj &&
                  'status' in obj))
          ),

          // Check for SvelteKit navigation stores
          hasSvelteKitStores: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              'subscribe' in obj &&
              // Store subscription patterns specific to SvelteKit
              (obj.subscribe.toString().includes('navigating') ||
                obj.subscribe.toString().includes('page') ||
                obj.subscribe.toString().includes('updated'))
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
      // SvelteKit specific data loading (minification resistant)
      /load\s*\(\s*\{\s*(?:params|url|route|depends)\s*\}/,
      /handle\s*\(\s*\{\s*event\s*,\s*resolve\s*\}\s*\)/,
      /handleError\s*\(\s*\{\s*error\s*,\s*event\s*\}\s*\)/,
      /setupLoadContext\(/,

      // SvelteKit internal routing patterns
      /goto\(\s*(?:url|delta):/,
      /pushState\(\s*\{\s*[^}]*sveltekit:/,
      /invalidateAll\(\s*\{\s*soft:\s*true\s*\}\)/,
      /preloadData\(\s*\{\s*type:\s*["']link["']/,

      // SvelteKit-specific error handling
      /handleMissingId\(/,
      /handleDataError\(/,
      /redirect\((?:\d{3}|\w+\.status)\s*,\s*(?:url|location):/,
      /error\((?:\d{3}|\w+\.status)\s*,\s*(?:message|text):/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // SvelteKit specific build artifacts
      /@sveltejs[\\/]kit[\\/]src[\\/]runtime[\\/][^/]+\.js$/,
      /sveltejs[\\/]kit[\\/]client\.[a-f0-9]+\.js$/i,
      /svelte-kit-[a-f0-9]+\.js$/i,

      // Generated route modules (with SvelteKit markers)
      /entry\.client-[a-f0-9]+\.js$/i,
      /sveltekit\.navigation-[a-f0-9]+\.js$/i,
      /sveltekit\.stores-[a-f0-9]+\.js$/i,

      // SvelteKit generated types and metadata
      /\.svelte-kit[\\/]runtime[\\/]/,
      /\.svelte-kit[\\/]types[\\/]/,
      /[\\/]\+(?:page|layout|error)(?:\.[jt]s|\+\d+\.js)$/i,
      /[\\/]\+server(?:\.[jt]s|\+\d+\.js)$/i,
    ],
  },
];
