import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const nextRouter = [
  {
    name: 'core' as const,
    score: 0.6,
    scripts: [
      // Router error handling and type checking
      /\.isNextRouterError\)\(/,

      /\[[\w.]*NEXT_ROUTER_STATE_TREE_HEADER/,

      // Router context and providers
      /GlobalLayoutRouterContext/,
      /extractPathFromFlightRouterState/,

      // Router hooks and params
      /useDynamicRouteParams\)\(["']useParams\(\)["']/,

      // Router error definitions
      /Object\.defineProperty\(Error\(["']invariant global layout router not mounted["']\),\s*["']__NEXT_ERROR_CODE["']/,

      // Router property exports
      /Object\.defineProperty\([^,]+,\s*["']createInitialRouterState["']/,

      // Next router data markers
      /["'](?:next\/(?:navigation|router|link|dist\/client\/router)|n\/r)["']/,
      /__NEXT_(?:DATA|P|C|HAS_REWRITE|ROUTER|HISTORY|OPTIMISTIC)__/,
    ],
  },
  {
    name: 'appRouter' as const,
    score: 0.6,
    scripts: [
      // App router markers
      /AppRouterContext/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Next.js globals (minification resistant)
          hasNextMarkers:
            !!window.next?.router ||
            !!window.__NEXT_P ||
            !!window.__NEXT_ROUTER_BASEPATH,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    scripts: [
      // Next.js internal patterns
      /[A-Za-z]\.__N(?:=|ext)|__N_SSG|__N_SSP/,
      /window\.__N(?:_STATE|EXT_P|_CROSS)/,

      // Error patterns specific to Next.js (survive minification)
      /err\.digest.*NEXT_NOT_FOUND/,
      /NEXT_REDIRECT.*permanent/,
    ],
  },
  {
    name: 'isNextJs' as const,
    score: 0.7,
    dependencies: (analysis: AnalysisFeatures) => {
      return analysis.framework.name === 'next';
    },
  },
];
