import { Page } from 'playwright';

export const raygun = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasRaygun: !!window.Raygun,
          hasRaygunInitialized: window.RaygunInitialized === true,
          hasRaygunBreadcrumbsFactory: !!window.RaygunBreadcrumbsFactory,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'hash' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.RaygunObject;
      });
    },
  },
  {
    name: 'storage' as const,
    score: 1.5,
    browser: async (page: Page) => {
      const hasPostHog = await page.evaluate(() => {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('raygun')) {
            return true;
          }
        }
        return false;
      });

      return hasPostHog;
    },
  },
  {
    name: 'userAgent' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.raygunUserAgent;
      });
    },
  },
  {
    name: 'global-onError' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return /\.computeStackTrace\.(augmentStackTraceWithInitialElement|guessFunctionName|gatherContext)/.test(
          window.onerror?.toString() ?? ''
        );
      });
    },
  },
  {
    name: 'core' as const,
    score: 1.2,
    scripts: [
      /_publicRaygunFunctions/,
      /Options\._raygunApiKey/,
      /Options\._raygunApiUrl/,
      /Not enabling RUM because Raygun4JS has detected a React Native environment/,
      /log\(['"]Raygun4JS:/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/cdn\.raygun\.io/],
  },
];
