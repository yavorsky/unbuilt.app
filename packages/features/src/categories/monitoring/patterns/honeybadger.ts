import { Page } from 'playwright';

export const honeybadger = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasHoneybadger: !!window.Honeybadger,
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
      return cookies.some((cookie) => /_honeybadger/.test(cookie.name));
    },
  },
  {
    name: 'core' as const,
    score: 1.2,
    scripts: [
      /userFeedbackEndpoint:\s*['"']https:\/\/api\.honeybadger\.io\/v2\/feedback['"']/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.unshift\(\s*['"']\[Honeybadger]['"']\s*\)/,
      /this\.logger\.debug\(['"']skipping error report: honeybadger\.js is disabled/,
      /this\.logger\.log\(['"']honeybadger\.js is in development mode; the following error report will be sent in production\./,
      /this\.addBreadcrumb\(['"']Honeybadger Notice/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.honeybadgerUserFeedbackOptions/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.___hb\.___hb/,
      /urlPrefix:\s*['"']https:\/\/app\.honeybadger\.io['"']/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/eu\-api\.honeybadger\.io/, /api\.honeybadger\.io/],
  },
];
