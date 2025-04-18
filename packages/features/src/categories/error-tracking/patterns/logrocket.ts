import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const logrocket = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasLogRocket: typeof window.LogRocket !== 'undefined',
          hasLogRocketConfig:
            typeof window.__LOGROCKET_CONFIG__ !== 'undefined',
          hasLRQueue: Array.isArray(window._LRQueue),
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
          hasLogRocketScripts: Array.from(
            document.querySelectorAll('script')
          ).some(
            (script) =>
              script.src &&
              (script.src.includes('cdn.logrocket.') ||
                script.src.includes('cdn.lr-') ||
                script.src.includes('logrocket@'))
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'core' as const,
    score: 1.2,
    scripts: [
      /\bLogrocket\b|\blogRocket\b|\bLR\b/i,
      /\._lr/,
      /\blr(_|\.)(?:send|init|identify|track)/i,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [
      /cdn\.logrocket\.(?:com|io)/,
      /cdn\.lr\-(?:ingest|intake|in|kt\-in)\.com/,
    ],
  },
  {
    name: 'persistence' as const,
    score: 2.5,
    dependencies: (analysis: AnalysisFeatures) => {
      if (analysis?.errorTracking?.confidence > 0) {
        return true;
      }
      return false;
    },
  },
];
