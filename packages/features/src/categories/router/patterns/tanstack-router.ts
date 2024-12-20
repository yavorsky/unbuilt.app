import { Page } from 'playwright';

export const tanstackRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core package imports (including minified variants)
      /["']@t(?:anstack)?[/\\-]router(?:-(?:core|devtools))?["']/,

      // TanStack-specific router creation (minification resistant)
      /(?:create|init)(?:React)?Router\s*\(\s*\{(?:\s*defaultPreload:|routeTree:)/,
      /(?:create|init)RouterWithConfig\s*\(\s*\{/,
      /routeTree\s*=\s*(?:builder|rootRoute)\.(?:createRoute|addChildren)/,

      // TanStack-specific hooks (minification resistant)
      /use(?:Router|Search|RouterContext|RouterState|RouterDevtools)\s*\(/,
      /\[\w+\]=\{(?:useRouter|useSearch|useRouterState)\}/,

      // Internal markers unique to TanStack
      /__TANSTACK_ROUTER_(?:STATE|HISTORY|DEVTOOLS)__/,
      /\$TS_ROUTER\$/,
      /\[RouterCacheKey\]/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for TanStack-specific globals
          hasTanStackMarkers:
            !!window.__TANSTACK_ROUTER_STATE__ ||
            !!window.__TANSTACK_ROUTER_HISTORY__ ||
            !!window.__TANSTACK_ROUTER_DEVTOOLS__,

          // Check for TanStack Router specific exports and properties
          hasTanStackInstance: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              // Core router instance properties
              (('latestLocation' in obj &&
                'subscribe' in obj &&
                'navigate' in obj) ||
                // Router state properties
                ('routeTree' in obj &&
                  'matches' in obj &&
                  'pendingMatches' in obj) ||
                // Router builder properties
                ('routeBuilder' in obj &&
                  'createRoute' in obj &&
                  'addChildren' in obj))
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
      // TanStack-specific route definitions (minification resistant)
      /createFileRoute\s*\(\s*['"][/\w]+['"]\s*,?\s*\{/,
      /createLazyFileRoute\s*\(\s*['"][/\w]+['"]\s*,?\s*\{/,
      /createRootRoute\s*\(\s*\{(?:\s*component:|beforeLoad:)/,

      // TanStack-specific type validation patterns
      /parse(?:Search|Params)With\s*\(\s*z\./,
      /validate(?:Search|Params)\s*:\s*z\./,

      // Internal implementation details (minification resistant)
      /\[NAVIGATE_OPTIONS_KEY\]/,
      /\[ROUTER_STATE_KEY\]/,
      /RouterStateKey/,
      /pendingNavigationController/,
      /routerStateRef/,

      // Unique TanStack features
      /maybePreloadRoute\s*\(/,
      /createRouteConfig\s*\(/,
      /buildRequestMatch\s*\(/,
      /getRouterState\s*\(/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // TanStack-specific chunks
      /@tanstack[\\/]router(?:-(?:core|devtools))?[-.]\w+\.js$/i,
      /tanstack-router[-.]\w+\.js$/i,

      // TanStack route file patterns (more specific than general routing)
      /\$?[\w-]+\.route\.[jt]sx?$/i,
      /routeTree\.gen\.[jt]sx?$/i,
    ],
  },
];
