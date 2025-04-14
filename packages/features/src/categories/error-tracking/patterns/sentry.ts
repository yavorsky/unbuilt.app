import { Page } from 'playwright';

export const sentry = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasSentry: !!window.__SENTRY__ || !!window.Sentry,
          hasRaven: !!window.Raven,
          hasRavenConfig: !!window.RavenConfig,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'elements' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasSentry: !!document.querySelector('[data-sentry-tag]'),
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
      return cookies.some((cookie) => /_clck|_clsk/.test(cookie.name));
    },
  },
  {
    name: 'sentry' as const,
    score: 1,
    scripts: [
      /Sentry responded with status code /,
      /\[["']x-sentry-rate-limits["']\]/,
      /\b[a-zA-Z_$][\w$]*\.headers\.get\(["']X-Sentry-Rate-Limits["']\)/,
      /\b[a-zA-Z_$][\w$]*\.setAttribute\(["']sentry\.idle_span_discarded_spans["'],\s*[a-zA-Z_$][\w$]*\)/,
      /warn\(["']Invalid sentry-trace data\. Cannot generate trace data["']\)/,
      /\b[a-zA-Z_$][\w$]*\[["']sentry\.browser\.measure_start_time["']\]/,
      /\b[a-zA-Z_$][\w$]*\.setAttribute\(["']sentry\.cancellation_reason["'],\s*["']document\.hidden["']\)/,
      /\b[a-zA-Z_$][\w$]*\.__sentry_own_request__/,
      /\b[a-zA-Z_$][\w$]*\.__sentry_xhr_span_id__/,
      /\b[a-zA-Z_$][\w$]*\._sentryRewriteFramesAssetPrefixPath\b/,
    ],
  },
  {
    name: 'raven' as const,
    score: 1,
    scripts: [
      /new\s+Error\(["']Raven send failed \(no additional details provided\)["']\)/,
      /["']Raven dropped repeat event: ["']/,
      /sentry_client:["']raven-js\/["']/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [
      /browser\.sentry-cdn\.com/,
      /js\.sentry-cdn\.com/,
      /cdn\.ravenjs\.com/,
    ],
  },
];
