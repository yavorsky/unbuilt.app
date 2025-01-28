import { Page } from 'playwright';

export const next = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      // Core Next.js-specific globals and identifiers
      /window\.__NEXT_P\s*=/, // Next.js page loader
      /__NEXT_CROSS_ORIGIN/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.3,
    scripts: [
      // Next.js-specific DOM attributes and classes
      /data-nextjs-page/,
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.3,
    scripts: [
      // Next.js-specific hydration markers
      /__NEXT_HYDRATED_STATE__/,
      /__NEXT_HYDRATE_MARKER__/,
      /__NEXT_DROP_CLIENT_FILE__/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasNextVersion: !!window.next?.version,
          hasNextRouteLoader: typeof window.__NEXT_P !== 'undefined',
          hasNextRegistry: typeof window.__NEXT_LOADED_PAGES__ !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    score: 2,
    name: 'ssr' as const,
    scripts: [/getServerSideProps/, /getInitialProps/],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Next.js data object
          hasNextData: !!window.__NEXT_DATA__,

          // Next.js specific props
          hasPageProps: document.querySelector('[data-nextjs-page]') !== null,

          // Static optimization indicator
          hasStaticOptimization: !!window.__NEXT_DATA__?.autoExport,

          // Server-side generated styles
          hasSSRStyles: !!document.querySelector('style[data-n-href]'),

          // Check for specific Next.js attributes
          hasNextAttributes: document
            .querySelector('[data-reactroot]')
            ?.hasAttribute('data-nextjs-page'),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  // Generic SSR detection
  // Disabling for now since this check takes too long
  // {
  //   score: 0,
  //   name: 'ssr-2' as const,
  //   browser: async (page: Page, browser: Browser) => {
  //     return detectSSRSignals(page, browser);
  //   },
  // },
];
