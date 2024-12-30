import { Page } from 'playwright';

export const remixRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Remix Router specific imports (minification resistant)
      /["']@remix-run\/router["']/,
      /["']@remix-run\/router\/history["']/,
      /["']@remix-run\/router\/data["']/,

      // Remix Router's internal markers (survive minification)
      /__remixRouter/,
      /__remixManifest/,
      /__remixContext/,
      /__remixRouteModules/,
      /\[Symbol\.for\(["']remix-router-state["']\)\]/,

      // Remix-specific state handlers (minification resistant)
      /createPath\(\{pathname:/,
      /getStateKeyForLocation\(/,
      /createClientSideRemixRouter\(/,
      /createRemixStub\(/,

      // Remix-specific data handling
      /createActionData\(/,
      /createLoaderData\(/,
      /createRouteData\(/,
      /createTransitionManager\(/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Remix Router specific globals
          hasRemixMarkers: !!(
            window.__remixRouter ||
            window.__remixContext ||
            window.__remixManifest ||
            // @ts-expect-error TS doesn't recognize Symbol type
            window[Symbol.for('remix-router-state')]
          ),

          // Check for Remix Router specific instance properties
          hasRemixInstance: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              // Remix router instance properties
              (('future' in obj &&
                'hydrationData' in obj &&
                '_internalFetchLinks' in obj) ||
                // Remix data router instance
                ('state' in obj &&
                  'loaderData' in obj &&
                  'actionData' in obj) ||
                // Remix transition manager
                ('location' in obj &&
                  'submission' in obj &&
                  'fetcherSubmission' in obj))
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    scripts: [
      // Remix-specific route patterns (minification resistant)
      /createClientRoute\(\{id:/,
      /createClientResolver\(\{routes:/,
      /UNSAFE_DEFERRED_SYMBOL/,
      /UNSAFE_ERROR_BOUNDARY_SYMBOL/,

      // Remix data handling patterns
      /getLoadingNavigation\(/,
      /getSubmissionNavigation\(/,
      /getRedirectNavigation\(/,
      /createTransitionRedirect\(/,

      // Remix-specific error handling
      /ErrorResponseImpl\(/,
      /isRouteErrorResponse\(/,
      /createClientError\(/,
      /getInternalRouterError\(/,

      // Remix internal implementation details
      /createClientSideRoute\(/,
      /createClientRouteLoader\(/,
      /createClientLoaderFunction\(/,
      /createDeferredReadable\(/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Remix Router specific build artifacts
      /@remix-run[\\/]router[\\/]dist[\\/]router\.js$/,
      /@remix-run[\\/]router[\\/]dist[\\/]data\.js$/,
      /@remix-run[\\/]router[\\/]dist[\\/]history\.js$/,

      // Remix-specific generated files
      /remix-router-[a-f0-9]+\.js$/i,
      /remix-client-[a-f0-9]+\.js$/i,
      /remix-routes-[a-f0-9]+\.js$/i,

      // Remix internal implementations
      /remix-route-loader\.[a-f0-9]+\.js$/i,
      /remix-action-handler\.[a-f0-9]+\.js$/i,
      /remix-transition-manager\.[a-f0-9]+\.js$/i,
    ],
  },
];
