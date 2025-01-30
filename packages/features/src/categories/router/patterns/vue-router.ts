import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const vueRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Vue Router specific package signatures
      /["']vue-router["']/,
      /["']@vue\/router["']/,

      // Vue Router's unique global properties
      /__VUE_ROUTER__/,
      /__VUE_ROUTER_BASE__/,

      // Vue Router specific components (only found in Vue Router)
      /defineComponent\(\{name:["']RouterView["']/,
      /defineComponent\(\{name:["']RouterLink["']/,
      /\{name:["']router-link["']/,
      /\{name:["']router-view["']/,

      // Vue Router's internal instance markers
      /\[routerViewLocationKey\]/,
      /\[matchedRouteKey\]/,
      /\[viewDepthKey\]/,
      /\[routerViewKey\]/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Only checking for Vue Router specific globals and properties
        const markers = {
          // Vue Router's unique global markers
          hasVueRouterGlobals:
            !!window.__VUE_ROUTER__ ||
            !!window.__VUE_ROUTER_BASE__ ||
            !!window.$router?.__VUE_ROUTER__ ||
            !!window.$route?.__VUE_ROUTER__,

          // Vue Router specific instance with its unique properties
          hasVueRouterInstance: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              // Vue Router's unique router instance properties
              (('currentRoute' in obj &&
                'options' in obj &&
                'hasRoute' in obj) ||
                // Vue Router's unique route location properties
                ('fullPath' in obj &&
                  'matched' in obj &&
                  'meta' in obj &&
                  'redirectedFrom' in obj) ||
                // Vue Router's installation properties
                ('install' in obj &&
                  'version' in obj &&
                  'RouterView' in obj &&
                  'RouterLink' in obj))
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    scripts: [
      // Vue Router's internal implementation details
      /\[START_LOCATION_NORMALIZED\]/,

      // Vue Router installation pattern
      /Vue\.use\(VueRouter(?:\s*,\s*\{|[\s\)])/,
      /app\.use\(router(?:\s*,\s*\{|[\s\)])/,
    ],
  },
  {
    name: 'isVue' as const,
    score: 0.3,
    dependencies: (analysis: AnalysisFeatures) => {
      return (
        analysis.uiLibrary.name === 'vue' &&
        analysis.framework.name !== 'vitepress' &&
        analysis.framework.name !== 'vuepress'
      );
    },
  },
];
