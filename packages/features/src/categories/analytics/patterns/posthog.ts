import { Page } from 'playwright';

export const posthog = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasPosthogGlobal: !!window.posthog,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'extensions' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasPosthogGlobal: !!window.__PosthogExtensions__,
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
      return cookies.some((cookie) => cookie.name.startsWith('ph_'));
    },
  },
  {
    name: 'storage' as const,
    score: 1.2,
    browser: async (page: Page) => {
      const hasPostHog = await page.evaluate(() => {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('ph_')) {
            return true;
          }
        }
        return false;
      });

      return hasPostHog;
    },
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/i\.posthog\.com/],
  },
];
