import { Page } from 'playwright';

export const googleAnalytics = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasGaGlobal: window.gaGlobal && window.gaGlobal.vid,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'data-layer' as const,
    score: 1.2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return (
          window.dataLayer &&
          Array.isArray(window.dataLayer) &&
          window.dataLayer.some((item) => item.event?.includes?.('gtm'))
        );
      });
    },
  },
  {
    name: 'cookie' as const,
    score: 1.2,
    browser: async (page: Page) => {
      const cookies = await page.context().cookies();
      return cookies.some((cookie) => cookie.name === '_ga');
    },
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [
      /\/ga\.js/,
      /googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+/,
      /googletagmanager\.com\/gtag\/js\?id=AW-\d+/,
      /googletagmanager\.com\/gtm\.js/,
      /googletagmanager\.com\/gtag\/js/,
    ],
  },
];
