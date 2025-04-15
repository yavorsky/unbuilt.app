import { Page } from 'playwright';

export const rollbar = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasRollbar: !!window.Rollbar,
          hasRollbarConfig: !!window._rollbarConfig,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'shims' as const,
    score: 1.2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasRollbarShims: !!window._rollbarShims,
          hasRollbarInitialized: !!window._rollbarInitialized,
          hasRollbarWrappedError: !!window._rollbarWrappedError,
          hasRollbarDidLoad: typeof window._rollbarDidLoad !== 'undefined',
          hasRollbarAccessToken:
            typeof window._rollbarAccessToken !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'errors' as const,
    score: 1.0,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!(
          window.onerror &&
          window.onerror.toString().includes('_rollbarWrappedError')
        );
      });
    },
  },
  {
    name: 'elements' as const,
    score: 1.2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasRollbarElements: !!document.querySelector('[data-rollbar]'),
          hasRollbarScripts: Array.from(
            document.querySelectorAll('script')
          ).some(
            (script) =>
              script.src &&
              (script.src.includes('rollbar.js') ||
                script.src.includes('rollbar.min.js') ||
                script.src.includes('cdn.rollbar.com'))
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'rollbar' as const,
    score: 1,
    scripts: [
      /rollbar\.min\.js/,
      /rollbar\.js/,
      /window\._rollbarConfig/,
      /\bRollbar\.error\(/,
      /\bRollbar\.warning\(/,
      /\bRollbar\.info\(/,
      /\bRollbar\.debug\(/,
      /\bRollbar\.critical\(/,
      /\bRollbar\.configure\(/,
      /\bRollbar\.log\(/,
      /\bnew\s+Rollbar\(/,
      /rollbar\.com\/api\/1\/item/,
      /rollbar\.com\/api\/1\/occurrences/,
      /_rollbarConfig=/,
      /_rollbarShims/,
      /_rollbarOldOnError/,
      /_rollbarWrappedError/,
      /window\._rollbarDidLoad/,
      /setupShim\(window,_rollbarConfig/,
      /rollbarJsUrl/,
      /r\._rollbarWrappedError/,
      /r\._rollbarOldOnError/,
      /\["log","debug","info","warn","warning","error","critical","global","configure"/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [
      /cdnjs\.cloudflare\.com\/ajax\/libs\/rollbar/,
      /rollbar\.com\/api\//,
      /cdn\.rollbar\.com\/rollbarjs/,
      /js\.sentry-cdn\.com\/.*\/rollbar/,
      /rollbarjs\/refs\/tags\/v[\d\.]+\/rollbar(\.min)?\.js/,
      /rollbar\.com\/rollbarjs\//,
    ],
  },
];
