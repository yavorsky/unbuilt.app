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
          hasRollbarAccessToken:
            typeof window._rollbarAccessToken !== 'undefined',
          hasRollbarShims: !!window._rollbarShims,
          hasRollbarInitialized: !!window._rollbarInitialized,
          hasRollbarWrappedError: !!window._rollbarWrappedError,
          hasRollbarDidLoad: typeof window._rollbarDidLoad !== 'undefined',
          hasRollbarOnError:
            window.onerror &&
            window.onerror.toString().includes('_rollbarWrappedError'),
        };
        return Object.values(markers).some(Boolean);
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
          ).some((script) => {
            if (!script.src && script.textContent) {
              return (
                script.textContent.includes('_rollbarConfig') ||
                script.textContent.includes('_rollbarShims') ||
                script.textContent.includes('rollbar.min.js') ||
                script.textContent.includes('captureUncaught')
              );
            }
            return (
              script.src &&
              (script.src.includes('rollbar.js') ||
                script.src.includes('rollbar.min.js') ||
                script.src.includes('cdn.rollbar.com'))
            );
          }),
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
      /function\(r\)\{var e=\{\};function o\(n\)\{if\(e\[n\]\)return/,
      /captureUncaught:\s*true/,
      /captureUnhandledRejections:\s*true/,
      /["']accessToken["']:\s*["'][a-f0-9]+["']/,
      /window\._rollbarDidLoad/,
      /loadFull\(window,document/,
      /setupShim\(window,_rollbarConfig/,
      /rollbarJsUrl/,
      /r\._rollbarWrappedError/,
      /r\._rollbarOldOnError/,
      /r\.onerror=a/,
      /handleUncaughtException/,
      /handleUnhandledRejection/,
      /\["log","debug","info","warn","warning","error","critical","global","configure"/,
      /window\.addEventListener\("load",l\.captureLoad\.bind\(l\)\)/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [
      /cdnjs\.cloudflare\.com\/ajax\/libs\/rollbar/,
      /d37gvrvc0wt4s1\.cloudfront\.net\/js\/\d+\/rollbar\.min\.js/,
      /rollbar\.com\/api\//,
      /cdn\.rollbar\.com\/rollbarjs/,
      /js\.sentry-cdn\.com\/.*\/rollbar/,
      /rollbarjs\/refs\/tags\/v[\d\.]+\/rollbar(\.min)?\.js/,
      /rollbar\.com\/rollbarjs\//,
    ],
  },
  {
    name: 'test' as const,
    score: 0.8,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        if (
          window.Rollbar &&
          typeof window.Rollbar.configure === 'function' &&
          typeof window.Rollbar.error === 'function'
        ) {
          const hasRollbar =
            typeof window.Rollbar.info === 'function' &&
            typeof window.Rollbar.debug === 'function' &&
            typeof window.Rollbar.warning === 'function';

          return hasRollbar;
        }
        return false;
      });
    },
  },
];
