import { Page } from 'playwright';

export const splitbee = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasSplitbeeGlobal: !!window.splitbee,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'splitBeeLoaded' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasSplitBeeLoaded: !!window.splitbeeLoaded,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'cookie' as const,
    score: 0.3,
    browser: async (page: Page) => {
      const cookies = await page.context().cookies();
      return cookies.some((cookie) => cookie.name.startsWith('sb_'));
    },
  },
  {
    name: 'storage' as const,
    score: 0.3,
    browser: async (page: Page) => {
      const hasSplitBee = await page.evaluate(() => {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb_')) {
            return true;
          }
        }
        return false;
      });

      return hasSplitBee;
    },
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/cdn\.splitbee\.io/],
  },
];
