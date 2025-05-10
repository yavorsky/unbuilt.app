import { Page } from 'playwright';

export const newrelic = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasNewRelic: !!window.newrelic,
          hasNRRequire: !!window.__nr_require,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'agents' as const,
    score: 1.2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasNewRelicAgent: typeof window.NREUM !== 'undefined',
          hasNRAgent: !!window.NR_AGENT,
          hasNRFlags: !!window.newrelicFeatureFlags,
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
          hasNewRelicScripts: Array.from(
            document.querySelectorAll('script')
          ).some(
            (script) =>
              script.src &&
              (script.src.includes('newrelic.js') ||
                script.src.includes('newrelic.min.js') ||
                script.src.includes('js-agent.newrelic.com') ||
                script.src.includes('bam.nr-data.net'))
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'newrelic' as const,
    score: 1,
    scripts: [
      /require\("\.\/lib\/agent"\)/,
      /newrelic\/security-agent/,
      /require\.cache\.__NR_cache/,
      /\b[a-zA-Z_$][\w$]*.recordSupportability/,
      /New\s+Relic\s+for\s+Node\.js/,
      /\b[a-zA-Z_$][\w$]*.recordFeatureFlagMetrics/,
      /\b[a-zA-Z_$][\w$]*.recordSourceMapMetric/,
      /set\s+app_name\s+in\s+your\s+newrelic/,
      /newrelic\.com\/.*\/agent/,
      /newrelic.*agent.*\.js/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [
      /js\.agent\.newrelic\.com/,
      /bam\.nr-data\.net/,
      /js-agent\.newrelic\.com\/nr-.+\.js/,
      /cdn\.newrelic\.com/,
      /newrelic\/browser-agent/,
      /newrelic.*\.js/,
    ],
  },
];
