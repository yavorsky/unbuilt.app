import { Page } from 'playwright';

export const sentry = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasAppdynamics: !!window.ADRUM,
          hasBoomr: !!window.BOOMR_start,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'globalKeys' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasStartTime: !!window['adrum-start-time'],
          hasAPIKey: !!window['adrum-app-key'],
          hasStrictDomainCookiesSetting:
            typeof window['adrum-use-strict-domain-cookies'] === 'boolean',
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
      return cookies.some((cookie) => /ADRUM/.test(cookie.name));
    },
  },
  {
    name: 'core' as const,
    score: 1.2,
    scripts: [
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.log\(['"']AppDynamics EUM cloud application key missing\. Please specify window\['adrum-app-key']\['"']\)/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.EventType\.ADRUM_XHR/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\[[a-zA-Z_$][a-zA-Z0-9_$]*\]\.adrumArgs/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.userConf\.adrumExtUrl(?:Http|Https)/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.adrumExtUrl/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/cdn\.appdynamics\.com/, /col\.eum-appdynamics\.com/],
  },
];
