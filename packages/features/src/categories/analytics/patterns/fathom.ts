import { Page } from 'playwright';

export const fathom = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasFathom: window.fathom && window.fathom.siteId,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'script' as const,
    score: 0.9,
    scripts: [
      /alert\s*\(\s*["']Fathom has been enabled for this website\.["']\s*\)/,
      /window\.dispatchEvent\s*\(\s*new\s+Event\s*\(\s*["']locationchangefathom["']\s*\)\s*\)/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/cdn\.usefathom\.com/],
  },
];
