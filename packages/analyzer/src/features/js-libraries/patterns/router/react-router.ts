import { Page } from 'playwright';

function hasHistoryModifications(history: History): boolean {
  return 'listen' in history && 'block' in history;
}

export const reactRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core imports (including minified variants)
      /["']r(?:eact)?-router(?:-dom)?["']/,
      /["']@remix-run\/router["']/,

      // Core components with flexible casing and potential renaming
      /(?:Browser|Hash|Memory|Static)?Router\b/,
      /(?:Nav)?Link\b/,
      /\bRoute[s]?\b/,
      /\bOutlet\b/,

      // Hook patterns that survive minification
      /use(?:Navigate|Location|Params|Routes?|SearchParams|Match|Href)\s*\(/,

      // Internal markers that survive minification
      /__REACT_ROUTER_HISTORY__/,
      /__REACT_ROUTER_GLOBAL_HISTORY__/,
      /\$\$HISTORY\$\$/,
      /__ROUTER_CONTEXT__/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for router global markers that survive minification
          hasRouter:
            !!window.__REACT_ROUTER_HISTORY__ ||
            !!window.__RR_HISTORY__ ||
            !!window.$RR,

          // Check for history object modifications
          hasHistory: hasHistoryModifications(window.history),

          // Check for common router properties on any global object
          hasRouterProps: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              'Router' in obj &&
              'Route' in obj &&
              'Link' in obj
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
      // Route configuration that survives minification
      /\{\s*path:\s*["']/,
      /\{\s*element:/,
      /\{\s*index:\s*!0\}/,
      /\{\s*errorElement:/,

      // Navigation patterns resistant to minification
      /\.push\s*\(\s*\{/,
      /\.replace\s*\(\s*\{/,
      /\.go\s*\(\s*-?\d+\)/,

      // Common route param patterns
      /\/:\w+/,
      /\/\*/,
      /\/\+/,

      // Data router patterns that survive minification
      /\b(?:loader|action):\s*async/,
      /use(?:Loader|Action)Data\s*\(/,
      /useRevalidator\s*\(/,

      // Common internal properties
      /\._location/,
      /\._routes/,
      /\._state/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Library chunks (including hash patterns)
      /r(?:eact)?-router[-.]\w+\.js$/i,
      /router\.?\w+\.js$/i,
      /routing\.?\w+\.js$/i,

      // Build tool output patterns
      /\brouter\.[a-f0-9]+\.js$/i,
      /\broutes?\.[a-f0-9]+\.js$/i,
      /\bpages?\.[a-f0-9]+\.js$/i,
      /chunk\.[a-f0-9]+\.js$/i,

      // Common project structure patterns
      /routes?[/\\]/i,
      /pages?[/\\]/i,
      /router[/\\]/i,
      /navigation[/\\]/i,

      // Generated route files
      /\.route\.\w+\.js$/i,
      /generated.*routes?/i,
    ],
  },
];
