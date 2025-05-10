import { Page } from 'playwright';

export const instana = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasSentry: !!window.ineum,
          hasRaven: !!window.eum,
          hasRavenConfig: !!window.instana,
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
      return cookies.some((cookie) => /__insp_/.test(cookie.name));
    },
  },
  {
    name: 'document' as const,
    score: 1.2,
    documents: [
      /<meta\s+name=["']instana["']\s+content=["'][^"']+["']\s*\/?>/, // <meta name="instana" content="...">
    ],
  },
  {
    name: 'scripts' as const,
    score: 1.2,
    scripts: [
      /(?:import|require)\s*\(\s*['"]@instana\/[^'"]*['"]\s*\)/,
      /\{\s*(?:ineum|instana|eum)(?:Key|Token|ApiKey):\s*['"][a-zA-Z0-9_-]+['"]/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/instana\.io/],
  },
];
