import { Page } from 'playwright';

// Extend Window interface for Vue Router globals
declare global {
  interface Window {
    __VUE_ROUTER__?: unknown;
    __VUE_ROUTER_HISTORY__?: unknown;
    $router?: unknown;
    $route?: unknown;
  }

  interface History {
    listen?: (callback: (to: any, from: any) => void) => () => void;
  }
}

export const vueRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core imports (including minified variants)
      /["']vue-router["']/,
      /["']@vue\/router["']/,
      /createRouter\s*\(/,
      /useRouter\s*\(/,

      // Router creation and configuration
      /createWebHistory\s*\(/,
      /createWebHashHistory\s*\(/,
      /createMemoryHistory\s*\(/,
      /routes:\s*\[/,

      // Vue Router specific globals and properties
      /\$router\./,
      /\$route\./,
      /__VUE_ROUTER__/,
      /RouterLink\b/,
      /RouterView\b/,

      // Common composition API usage
      /useRoute\s*\(/,
      /useLink\s*\(/,
      /useRouteParams\s*\(/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Vue Router globals
          hasRouter:
            !!window.__VUE_ROUTER__ || !!window.$router || !!window.$route,

          // Check for router instance
          hasInstance: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              'currentRoute' in obj &&
              'options' in obj &&
              'push' in obj &&
              'replace' in obj
          ),

          // Check for Vue devtools integration
          hasDevTools: !!window.__VUE_DEVTOOLS_GLOBAL_HOOK__?.Vue?.$router,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Route configuration patterns
      /path:\s*["']\//,
      /component:\s*\w+/,
      /components:\s*\{/,
      /name:\s*["']\w+["']/,
      /meta:\s*\{/,

      // Navigation Guards
      /beforeEach\s*\(/,
      /afterEach\s*\(/,
      /beforeResolve\s*\(/,
      /beforeRouteEnter\s*\(/,
      /beforeRouteUpdate\s*\(/,
      /beforeRouteLeave\s*\(/,

      // Common router methods
      /\.push\s*\(/,
      /\.replace\s*\(/,
      /\.go\s*\(/,
      /\.back\s*\(/,
      /\.forward\s*\(/,

      // Route params and queries
      /params\.[a-zA-Z]/,
      /query\.[a-zA-Z]/,
      /hash:/,

      // Lazy loading
      /component:\s*\(\)\s*=>\s*import\(/,
      /components:\s*\{\s*\w+:\s*\(\)\s*=>\s*import\(/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Library files
      /vue-router(?:\.min)?\.js$/i,
      /router(?:-\w+)?\.js$/i,
      /@vue\/router/i,

      // Common project patterns
      /router\/index\.[jt]s$/i,
      /router\.config\.[jt]s$/i,
      /routes?\.[jt]s$/i,

      // Build output patterns
      /\brouter\.[a-f0-9]+\.js$/i,
      /\broutes?\.[a-f0-9]+\.js$/i,
      /chunk-\w+\.[a-f0-9]+\.js$/i,

      // Common Vue patterns
      /views?\//i,
      /pages?\//i,
      /layouts?\//i,
      /\.vue$/i,
    ],
  },
];
