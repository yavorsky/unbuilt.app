import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const vuepressRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.8,
    scripts: [
      // VuePress-specific route data structure that survives minification
      /@vuepress\/(?:core|theme-default)/,

      // Distinctive VuePress router error messages
      /404\s*page\s*could\s*not\s*be\s*found\./,
      /\[\s*vuepress\s*\]\s*page\s*not\s*found:/,

      // Common patterns in minified VuePress code
      /\.hasOwnProperty\("internal_routes"\)/,
    ],
  },
  {
    score: 1,
    name: 'browser-checks' as const,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          container:
            document.querySelector(
              'div.vp-theme-container, div[vp-container]'
            ) !== null,
          hasNavbar: document.querySelector('.vp-theme-container') !== null,
          hasSidebar: document.querySelector('.vp-sidebar-mask') !== null,
          hasHome: document.querySelector('.vp-home') !== null,
          hasContent:
            document.querySelector('div[vp-content], div.vp-content') !== null,
        };

        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    scripts: [
      // VuePress navigation components
      /RouterLink\s*name=["'](?:vuepress)-/,

      // VuePress-specific route handling
      /resolveMatchingRoute|resolvePageComponent/,

      // VuePress markdown renderer markers
      /@vuepress\/markdown|markdown-it/,

      // Theme layout resolution patterns
      /resolveThemeLayout|resolveLayoutComponent/,
    ],
  },
  {
    name: 'dependencies' as const,
    score: 0.7,
    dependencies: (analysis: AnalysisFeatures) => {
      return (
        analysis.uiLibrary.name === 'vue' &&
        analysis.framework.name === 'vuepress'
      );
    },
  },
];
