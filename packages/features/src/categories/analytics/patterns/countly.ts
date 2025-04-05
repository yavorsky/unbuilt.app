import { Page } from 'playwright';

export const countly = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasCountly: typeof window.Countly !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'dom' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasCountlyUseragent:
            document.querySelector('[data-countly-useragent]') !== null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'storage' as const,
    score: 1,
    browser: async (page: Page) => {
      const storage = await page.context().storageState();

      return storage.origins.some((origin) =>
        origin.localStorage.some((item) => {
          // Check for cly_ and xxx/cly_
          if (item.name.includes('cly_')) {
            return true;
          }

          return false;
        })
      );
    },
  },
  {
    name: 'script' as const,
    score: 1,
    scripts: [
      /["']initialize, Countly initialized["']/,
      /["']halt, Resetting Countly["']/,
      /["']enable_offline_mode, Countly is already in offline mode["']/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/countly-sdk-web/],
  },
];
