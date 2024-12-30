import { Page } from 'playwright';

export const docusaurus = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      // Docusaurus-specific globals and identifiers
      /window\.__docusaurus/,
      /__DOCUSAURUS_CHUNK_LOADING_MANIFEST/,
      /__DOCUSAURUS_ASYNC_LOADER__/,
      /__DOCUSAURUS_SSR__/,
      /window\.__DOCUSAURUS_CONTEXT__/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.9,
    scripts: [
      // Docusaurus-specific DOM elements and classes
      /div\[class\*="docusaurus"\]/,
      /div\[class\*="navbar--fixed-top"\]/,
      /div\[class\*="main-wrapper"\]/,
      /div\[class\*="theme-doc-markdown"\]/,
      /div\[class\*="docs-wrapper"\]/,
      /class="navbar__brand"/,
      /class="docusaurus-highlight-code-line"/,
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.8,
    scripts: [
      // Docusaurus hydration and client-specific markers
      /__DOCUSAURUS_INITIAL_STATE__/,
      /__DOCUSAURUS_CLIENT_CONTEXT__/,
      /window\.__DOCUSAURUS\.routeDidUpdate/,
      /window\.__DOCUSAURUS\.prefetch/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasDocusaurus: typeof window?.__docusaurus !== 'undefined',
          hasDocusaurusContext:
            typeof window?.__DOCUSAURUS_CONTEXT__ !== 'undefined',
          hasThemeDoc: !!document.querySelector('.theme-doc-markdown'),
          hasNavbar: !!document.querySelector('.navbar--fixed-top'),
          hasMainWrapper: !!document.querySelector('.main-wrapper'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    score: 0.3,
    name: 'ssr' as const,
    scripts: [
      // Docusaurus SSR-specific patterns
      /__DOCUSAURUS_SSR__/,
      /window\.__DOCUSAURUS_SSR_CONTEXT__/,
      /data-docusaurus-ssr="true"/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Docusaurus SSR context
          hasSSRContext:
            typeof window?.__DOCUSAURUS_SSR_CONTEXT__ !== 'undefined',

          // Server rendered attribute
          hasSSRAttribute: !!document.querySelector('[data-docusaurus-ssr]'),

          // Check for preloaded data
          hasPreloadedData: !!document.querySelector(
            'script[type="application/json"][data-docusaurus-ssr]'
          ),

          // Check for Docusaurus container with SSR content
          hasSSRContent: !!document.querySelector(
            '.main-wrapper[data-docusaurus-ssr]'
          ),

          // Check for SSR metadata
          hasSSRMetadata: !!document.querySelector(
            'meta[name="docusaurus-ssr"]'
          ),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
];
