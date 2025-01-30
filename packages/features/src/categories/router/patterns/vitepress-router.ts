import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const vitepressRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.5,
    scripts: [
      // VitePress's md route normalization pattern
      /\.md\.js"\},"(\w+)":{"importName/,
    ],
  },
  {
    name: 'routing' as const,
    score: 0.4,
    scripts: [
      // VitePress's route path cleanup - unique to its router
      /\.replace\(\/(?:\(\^|\\\/)index(?:\.html\)\$|\\\/)\/,\s*["']\$1["']\)/,
    ],
  },
  {
    name: 'browser-checks' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return typeof window.__VP_HASH_MAP__ === 'object';
      });
    },
  },
  {
    name: 'isVitepress' as const,
    score: 0.7,
    dependencies: (analysis: AnalysisFeatures) => {
      return (
        analysis.uiLibrary.name === 'vue' &&
        analysis.framework.name === 'vitepress'
      );
    },
  },
];
