import { Page } from 'playwright';

export const clarity = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasClarity: !!window.clarity,
          hasClarityUETQ: !!window.clarityuetq,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'cookie' as const,
    score: 1.2,
    browser: async (page: Page) => {
      const cookies = await page.context().cookies();
      return cookies.some((cookie) => /_clck|_clsk/.test(cookie.name));
    },
  },
  {
    name: 'script' as const,
    score: 0.9,
    scripts: [
      /Error CL001: Multiple Clarity tags detected/,
      /['"]claritySheetId['"]/,
      /['"]clarityOperationCount['"]/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/clarity\.ms/, /clarity\.js/],
  },
];
