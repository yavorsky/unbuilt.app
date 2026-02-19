import { Page } from 'playwright';

// anime.js — the word "anime" alone is too generic.
// Focus on package filenames and the runtime global.
export const animejs = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/animejs[.\-@/]/, /anime\.min\.js/, /anime\.es\.js/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.8,
    scripts: [
      /"animejs"/, // Package self-reference
    ],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // anime.js registers as window.anime with specific properties
        const anime = (window as Record<string, unknown>).anime;
        if (anime === undefined || typeof anime !== 'function') return false;
        return typeof (anime as unknown as Record<string, unknown>).timeline === 'function';
      });
    },
  },
];
