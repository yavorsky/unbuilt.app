import { Page } from 'playwright';

export const vueRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Vue Router specific package signatures
      /["']vue-router["']/,
      /["']@vue\/router["']/,

      // Vue Router's unique global properties
      /\$router\./,
      /\$route\./,
      /__VUE_ROUTER__/,
      /__VUE_ROUTER_BASE__/,

      // Vue Router specific components (only found in Vue Router)
      /defineComponent\(\{name:["']RouterView["']/,
      /defineComponent\(\{name:["']RouterLink["']/,
      /\{name:["']router-link["']/,
      /\{name:["']router-view["']/,

      // Vue Router specific initialization with its unique options
      /createRouter\(\{(?:\s*history:\s*createWebHistory|routes:)/,
      /useRouter\(\)\.(?:currentRoute|hasRoute|getRoutes)/,

      // Vue Router's internal instance markers
      /\[routerViewLocationKey\]/,
      /\[routerKey\]/,
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
    runtime: [
      // Vue Router's unique navigation guards
      /beforeRouteEnter\s*\(\s*to\s*,\s*from\s*,\s*next\s*\)/,
      /beforeRouteUpdate\s*\(\s*to\s*,\s*from\)/,
      /beforeRouteLeave\s*\(\s*to\s*,\s*from\)/,

      // Vue Router specific composition API
      /useRoute\(\)\.(?:params|query|hash|matched)/,
      /useRouter\(\)\.(?:push|replace|resolve|hasRoute)/,
      /useLink\((?:props|inProps)\)/,

      // Vue Router's internal implementation details
      /\[START_LOCATION_NORMALIZED\]/,
      /\[NavigationFailureType\]/,
      /ErrorTypeMessages\[/,

      // Vue Router's unique error types
      /NAVIGATION_(?:ABORTED|CANCELLED|DUPLICATED|GUARD_[A-Z_]+)/,

      // Vue Router installation pattern
      /Vue\.use\(VueRouter(?:\s*,\s*\{|[\s\)])/,
      /app\.use\(router(?:\s*,\s*\{|[\s\)])/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Only Vue Router specific file patterns
      /vue-router(?:\.esm)?(?:\.min)?[-.]\w+\.js$/i,
      /@vue[\\/]router[-.]\w+\.js$/i,
      /router-view-functional[-.]\w+\.js$/i,
      /router-link[-.]\w+\.js$/i,
      /vue-router-composables[-.]\w+\.js$/i,
    ],
  },
];
