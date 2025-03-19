import { Page } from 'playwright';

export const vercelAnalytics = [
  {
    name: 'globals' as const,
    score: 1.2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const vaString =
          typeof window.va === 'function'
            ? (window.va.toString() as string)
            : '';
        const vercelRegexp =
          /"(beforeSend|event|pageview|enableCookie)".*?(route|path|withReferrer)/;
        const markers = {
          hasGlobalVAMarker: vercelRegexp.test(vaString),
          hasVAQ: Array.isArray(window.vaq),
          hasVercelAnalyticsPath:
            typeof window.__vercel_analytics === 'function',
          windowVaiExists: window.vai === true,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'script' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasVercelAnalyticsScript:
            document.querySelectorAll(
              'script[data-sdkn="@vercel/analytics/next"], script[data-sdkn="@vercel/analytics"]'
            ).length > 0,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'paths' as const,
    score: 0.9,
    filenames: [/\/_?vercel\/insights\//],
  },
];
