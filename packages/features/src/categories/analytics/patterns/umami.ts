import { Page } from 'playwright';

export const umami = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasUmami: window.umami && typeof window.umami.track === 'function',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'script' as const,
    score: 1,
    scripts: [/['"]\s*x-umami-cache\s*['"]/, /data-umami-event-/],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/api-gateway\.umami\.dev/],
  },
];
