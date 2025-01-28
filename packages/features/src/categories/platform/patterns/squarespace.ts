import { Page } from 'playwright';

export const squarespace = [
  {
    name: 'scripts' as const,
    score: 0.8,
    scripts: [
      // Squarespace core scripts
      /sqsp\.net\//,
      // Squarespace specific initialization
      /Squarespace\.afterBodyLoad/,
      /Squarespace\.globalInit/,
      /Universal\.premiumInit/,
    ],
    documents: [
      // Squarespace meta tags
      /<meta\s+content="Squarespace.*?"\s+name="generator"/,
      // Squarespace specific markers
      /data-type="page-section"/,
      /data-controller=".*?SiteLoader"/,
      /sqs-block/,
    ],
  },
  {
    name: 'isEditor' as const,
    score: 1,
    browser: async (page: Page) => {
      const pathname = page.url();
      if (/^https:\/\/[\w-]+\.squarespace\.com\/config\//.test(pathname)) {
        return true;
      }
      return page.evaluate(() => {
        const markers = {
          hasEditorGlobals: window.Static?.IS_IN_CONFIG,
          hasConfigClass:
            document.querySelector('.squarespace-config ') !== null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isDashboard' as const,
    score: 1,
    browser: async (page: Page) => {
      const pathname = page.url();
      return pathname.startsWith('https://account.squarespace.com');
    },
  },
  {
    name: 'isWebsite' as const,
    score: 1,
    browser: async (page: Page) => {
      const pathname = page.url();
      // For config page, we have seprate group of patterns - isEditor.
      if (/^https:\/\/[\w-]+\.squarespace\.com\/config\//.test(pathname)) {
        return false;
      }
      return page.evaluate(() => {
        const markers = {
          hasSquarespaceContext:
            typeof window.Static?.SQUARESPACE_CONTEXT !== 'undefined',
          hasSquarespaceGlobals: typeof window.Squarespace !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'siteStructure' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Squarespace sections and blocks
          hasBlocks: document.querySelector('.sqs-block') !== null,
          // Check for Squarespace commerce elements
          hasCommerce:
            document.querySelector(
              '.sqs-product-quick-view-button, .sqs-money-native'
            ) !== null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'networking' as const,
    score: 0.6,
    headers: {
      'x-sq-version': /.+/,
      'x-sqs-page-id': /.+/,
    },
    filenames: [
      /\.squarespace\.com\//,
      /\.sqsp\.net\//,
      /static1\.squarespace\.com\//,
      /assets\.squarespace\.com\//,
    ],
  },
];
