import { Page } from 'playwright';

export const weebly = [
  {
    name: 'scripts' as const,
    score: 1,
    scripts: [
      // Weebly platform specific scripts
      /_api\/weebly\/v1/,
      // Weebly specific patterns
      /weebly-libraries/,
    ],
    documents: [
      // Weebly meta tags
      /<meta\s+name="generator"\s+content="Weebly/,
      // Weebly specific markers
      /wsite-/,
      /data-wsite-id/,
    ],
  },
  {
    name: 'isEditor' as const,
    score: 2,
    browser: async (page: Page) => {
      const pathname = page.url();
      const weeblyEditorPattern =
        /weebly\.com\/app\/website\/users\/\d+\/sites\/\d+\/dashboard\/editor(?:#\/page\/[a-f0-9-]+)?/;
      if (weeblyEditorPattern.test(pathname)) {
        return true;
      }
      return page.evaluate(() => {
        const markers = {
          hasWeeblyEditor: typeof window.WeeblyEditor !== 'undefined',
          hasEditorEnv: typeof window._W?.editor !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isWebsite' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasWeeblyJs: typeof window.Weebly !== 'undefined',
          hasWeeblyConfig: typeof window._W?.Analytics !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isDashboard' as const,
    score: 2,
    browser: async (page: Page) => {
      const pathname = page.url();
      const weeblyDashboardPattern =
        /weebly\.com\/app\/(?:home|website)\/users\/\d+\/sites\/\d+\/dashboard\/?/;
      if (weeblyDashboardPattern.test(pathname)) {
        return true;
      }
      return page.evaluate(() => {
        const markers = {
          hasWeeblyDashboard: typeof window.WeeblyDashboard !== 'undefined',
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
          // Check for Weebly specific DOM structure
          hasWeeblyContainer: document.querySelector('.w-container') !== null,
          hasWeeblySection: document.querySelector('.w-section') !== null,
          hasWeeblyBlock: document.querySelector('.w-block') !== null,
          hasWeeblyWrapper: document.querySelector('.w-wrapper') !== null,
        };
        return Object.values(markers).length >= 2;
      });
    },
  },
  {
    name: 'networking' as const,
    score: 0.6,
    headers: {
      'x-weebly-generated': /.+/,
      'x-weebly-route': /.+/,
    },
    filenames: [/\.weebly\.com\//, /\.editmysite\.com\//, /cdn-website\.com\//],
  },
];
