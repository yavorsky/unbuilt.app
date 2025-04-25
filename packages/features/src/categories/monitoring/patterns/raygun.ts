import { Page } from 'playwright';

export const raygun = [
  {
    name: 'breadcrumbs' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.raygunBreadcrumbsFactory;
      });
    },
  },
  {
    name: 'coreWebVital' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.raygunCoreWebVitalFactory;
      });
    },
  },
  {
    name: 'errorUtilities' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.raygunErrorUtilitiesFactory;
      });
    },
  },
  {
    name: 'meta' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.raygunUserAgent;
      });
    },
  },
  {
    name: 'meta' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!window.raygunUserAgent || !!window.raygunSnowplow;
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
      /this\.DEFAULT_XHR_IGNORED_HOSTS\s*=\s*\[\s*['"']raygun['"']\s*\]/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*['"']raygun4js-userid['"']/,
      /Options\._raygunApiUrl\s*=\s*['"']https:\/\/api\.raygun\.io['"']/,
      /constructNewRaygun:/,
      /[a-zA-Z_$][a-zA-Z0-9_$]*\.RaygunObject/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/cdn\.raygun\.io/, /api\.raygun\.io/],
  },
];
