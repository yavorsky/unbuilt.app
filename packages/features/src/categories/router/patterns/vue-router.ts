import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const vueRouter = [
  {
    name: 'coreRuntime' as const,
    score: 1,
    scripts: [
      // Core Router Components - These survive minification and are unique to Vue Router
      /\{name:["']RouterLink["']/,
      /\{name:["']RouterView["']/,

      // Unique Router Installation Pattern - This combination is specific to Vue Router
      /component\(["']RouterLink["'],[^)]+\).*component\(["']RouterView["']/,

      // Route Record Properties - This combination is unique to Vue Router
      /\{path:[^}]+component:[^}]+name:/,

      // Router Instance Properties - This specific combination only exists in Vue Router
      /\{currentRoute:[^}]+resolve:[^}]+beforeEach:/,

      // Navigation Guard Combinations - These patterns are unique to Vue Router
      /beforeRouteLeave[^}]+beforeRouteEnter/,

      // Router Mode Definition - Unique to Vue Router's history modes
      /createWebHistory|createWebHashHistory|createMemoryHistory/,
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
    ],
  },
  {
    name: 'browserChecks' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Check for specific combinations that only exist in Vue Router
        return Boolean(
          // Router Instance Check
          (window.$router &&
            // Must have ALL these methods to be Vue Router
            typeof window.$router.push === 'function' &&
            typeof window.$router.replace === 'function' &&
            typeof window.$router.resolve === 'function' &&
            // And these specific properties
            'currentRoute' in window.$router &&
            'options' in window.$router) ||
            // Route Object Check
            (window.$route &&
              // Must have this specific combination
              'matched' in window.$route &&
              'meta' in window.$route &&
              'params' in window.$route &&
              'path' in window.$route) ||
            // Router Component Check
            Object.values(window).some(
              (obj) =>
                obj &&
                typeof obj === 'object' &&
                // Look for specific Vue Router component registration
                obj.RouterView?.name === 'RouterView' &&
                obj.RouterLink?.name === 'RouterLink'
            )
        );
      });
    },
  },
  {
    name: 'old-borwserChecks' as const,
    score: 0.7,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Only checking for Vue Router specific globals and properties
        const markers = {
          has$routerGlobals:
            (window.$router &&
              // Must have ALL these methods to be Vue Router
              typeof window.$router.push === 'function' &&
              typeof window.$router.replace === 'function' &&
              typeof window.$router.resolve === 'function' &&
              // And these specific properties
              'currentRoute' in window.$router &&
              'options' in window.$router) ||
            // Route Object Check
            (window.$route &&
              // Must have this specific combination
              'matched' in window.$route &&
              'meta' in window.$route &&
              'params' in window.$route &&
              'path' in window.$route) ||
            // Router Component Check
            Object.values(window).some(
              (obj) =>
                obj &&
                typeof obj === 'object' &&
                // Look for specific Vue Router component registration
                obj.RouterView?.name === 'RouterView' &&
                obj.RouterLink?.name === 'RouterLink'
            ),
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
    score: 0.4,
    scripts: [
      // Unique Router Navigation Guard Patterns
      /\{beforeEnter:[^}]+meta:/,

      // Route Configuration Patterns - Must include multiple router-specific properties
      /\{path:[^}]+component:[^}]+children:/,
      /\{name:[^}]+path:[^}]+component:/,

      // Router Installation Pattern with Global Properties
      /globalProperties\.\$router/,
      /globalProperties\.\$route/,

      // Route Match Processing - Unique to Vue Router's internal processing
      /matched\.length[^}]+params[^}]+query[^}]+hash/,
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
