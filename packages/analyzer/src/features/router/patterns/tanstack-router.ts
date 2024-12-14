import { Page } from 'playwright';

export const tanstackRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core imports (including minified variants)
      /["']@tanstack\/router["']/,
      /["']@tanstack\/router-core["']/,
      /["']@tanstack\/router-devtools["']/,

      // Router creation and configuration
      /createRouter\s*\(/,
      /createRoutesFromElements\s*\(/,
      /createReactRouter\s*\(/,
      /createMemoryHistory\s*\(/,
      /createBrowserHistory\s*\(/,

      // Core components
      /RouterProvider\b/,
      /\bRoute\b/,
      /\bOutlet\b/,
      /\bLink\b/,

      // Hooks and utilities
      /useRouter\s*\(/,
      /useMatch\s*\(/,
      /useNavigate\s*\(/,
      /useSearch\s*\(/,
      /useParams\s*\(/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for TanStack Router globals
          hasRouter:
            !!window.__TANSTACK_ROUTER_STATE__ ||
            !!window.__TANSTACK_ROUTER_HISTORY__,

          // Check for devtools
          hasDevTools: !!window.__TANSTACK_ROUTER_DEVTOOLS__,

          // Check for router instance
          hasInstance: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              'latestLocation' in obj &&
              'subscribe' in obj &&
              'navigate' in obj
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
      // Route configuration patterns
      /path:\s*["']\//,
      /element:\s*[<\w]/,
      /errorElement:\s*[<\w]/,
      /loader[Fn]?:\s*async/,

      // Type-safe patterns specific to TanStack Router
      /createRoute\s*\(/,
      /createRootRoute\s*\(/,
      /createFileRoute\s*\(/,
      /createLazyFileRoute\s*\(/,

      // Search params and validation
      /parseSearchWith\s*\(/,
      /validateSearch\s*\(/,
      /parseParams\s*\(/,
      /validateParams\s*\(/,

      // Internal implementation details
      /notFound\s*\(/,
      /dehydrate\s*\(/,
      /hydrate\s*\(/,

      // Error handling
      /RouterError\b/,
      /isRouterError\s*\(/,
      /getRouterError\s*\(/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Library files
      /@tanstack\/router/i,
      /tanstack-router/i,
      /router\.[jt]sx?$/i,

      // Route files
      /routes\/\$?\w+\.[jt]sx?$/i,
      /\.?route\.[jt]sx?$/i,
      /\$?\w+\.route\.[jt]sx?$/i,

      // Common project patterns
      /routes?\/index\.[jt]sx?$/i,
      /routes?\/root\.[jt]sx?$/i,
      /routes?\/config\.[jt]sx?$/i,

      // Build output patterns
      /\brouter\.[a-f0-9]+\.js$/i,
      /\broutes\.[a-f0-9]+\.js$/i,
      /chunk-router\.[a-f0-9]+\.js$/i,

      // Generated files
      /routeTree\.gen\.[jt]sx?$/i,
      /\.generated\.[jt]sx?$/i,
    ],
  },
];
