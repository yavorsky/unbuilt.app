import { Page } from 'playwright';

export const matomo = [
  {
    name: 'globals' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasPAQ: !!window._paq,
          hasMatomo: !!window.Matomo,
          hasMatomoPluginAsyncInit: !!window.matomoPluginAsyncInit,
          // Legacy name
          hasPiwik: !!window.Piwik,
          hasTagManager: !!window.MatomoTagManager,
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
      return cookies.some((cookie) => /_pk_(id|ses|ref)/.test(cookie.name));
    },
  },
  {
    name: 'script' as const,
    score: 0.9,
    scripts: [/matomo not loaded yet, waiting for it to be loaded/],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/cdn\.matomo\.cloud/],
  },
];
