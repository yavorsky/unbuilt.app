import { AnalysisFeatures } from '../../../types/analysis.js';
import { vueRouter } from './vue-router.js';

export const vuepressRouter = [
  // vuepressRouter is based on vue-router
  ...vueRouter,
  {
    name: 'coreRuntime' as const,
    score: 1,
    scripts: [
      // VuePress-specific route data structure that survives minification
      /@vuepress\/(?:core|theme-default)/,
      /__VUEPRESS_ROUTER_BASE__/,
      /\[vuepress\] No matching page found for sidebar item/,

      // Distinctive VuePress router error messages
      /\[\s*vuepress\s*\]\s*page\s*not\s*found:/,

      // Common patterns in minified VuePress code
      /\.hasOwnProperty\("internal_routes"\)/,
    ],
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
    score: 2,
    dependencies: (analysis: AnalysisFeatures) => {
      return (
        analysis.uiLibrary.name === 'vue' &&
        analysis.framework.name === 'vuepress'
      );
    },
  },
];
