import { Page } from 'playwright';

export const gatsby = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // Core Gatsby global markers
      /__GATSBY/,
      /__GATSBY_RESOLVED_PAGES/,
      /__GATSBY_DEFERRED_CODEGEN/,
      /__GATSBY_CHUNK_MAP/,
      /window\.___GATSBY/,
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.9,
    runtime: [
      // Gatsby-specific hydration markers
      /__GATSBY_REGISTER_COMPONENT/,
      /__GATSBY_DYNAMIC_CHUNK_MAP/,
      /__GATSBY_ERROR_OVERLAY_HANDLER/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Core Gatsby globals
          hasGatsbyGlobal: typeof window.___gatsby !== 'undefined',
          hasLoader: typeof window.___loader !== 'undefined',
          hasEmitter: typeof window.___emitter !== 'undefined',

          // Navigation system
          hasNavigate: typeof window.___navigate === 'function',

          // Page data system
          hasPageData:
            typeof window.pagePath !== 'undefined' ||
            typeof window.pageData !== 'undefined',

          // Hydration markers
          hasHydrationMarkers:
            typeof window.__GATSBY !== 'undefined' ||
            document.querySelector('[data-gatsby]') !== null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'routing' as const,
    score: 0.8,
    runtime: [
      // Gatsby-specific routing markers
      /___loader/,
      /___emitter/,
      /window\.___navigate/,
      /window\.___replacePath/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.6,
    filenames: [
      /gatsby-config\.[jt]s$/,
      /gatsby-node\.[jt]s$/,
      /gatsby-ssr\.[jt]s$/,
      /gatsby-browser\.[jt]s$/,
    ],
  },
];
