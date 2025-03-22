import { Page } from 'playwright';

export const plausible = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasPlausible: typeof window.plausible === 'function',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'script' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!document.querySelector('script[data-domain]');
      });
    },
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/plausible\.io\/js|plausible\.io\/api\/event|\/plausible\.js/],
  },
];
