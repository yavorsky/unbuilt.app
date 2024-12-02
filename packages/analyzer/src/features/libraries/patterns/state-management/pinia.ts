import { Page } from 'playwright';

export const pinia = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Pinia imports (includes minified variants)
      /["'](?:p|pi|pin)ia["']/,
      /["']@vue\/pinia["']/,
      /["'](?:p|pi|pin)ia\/(?:dist|nuxt|testing)["']/,

      // Core store functions
      /defineStore\s*\(/,
      /createPinia\s*\(/,
      /usePinia\s*\(/,
      /useStore\s*\(/,
      /storeToRefs\s*\(/,

      // Store definition patterns
      /defineStore\s*\(\s*['"]\w+['"]\s*,/,
      /defineStore\s*\(\s*\{/,

      // Vue integration
      /app\.use\s*\(\s*(?:createPinia|pinia)\s*\)/,
      /Vue\.use\s*\(\s*(?:createPinia|pinia)\s*\)/,

      // Internal Pinia markers
      /__PINIA__/,
      /__pinia__/,
      /PiniaVuePlugin/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Pinia instance
          hasPinia: !!window.__PINIA__ || !!window.pinia || !!window.__pinia__,

          // Check for Vue devtools integration
          hasDevtools:
            !!window.__PINIA_DEVTOOLS_EXTENSION__ ||
            !!window.__VUE_DEVTOOLS_PLUGIN__?.pinia,

          // Check for store registry
          hasStores: !!window.__pinia_stores__ || !!window.__PINIA_STORES__,

          // Check for Vue integration
          hasVue: !!window.Vue?.use || !!window.__VUE_HMR_RUNTIME__?.pinia,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Store composition patterns
      /state:\s*\(\s*\)\s*=>\s*\({/,
      /getters:\s*\{/,
      /actions:\s*\{/,

      // Composition API usage
      /computed\s*\(/,
      /ref\s*\(/,
      /reactive\s*\(/,

      // Store interaction patterns
      /\$patch\s*\(/,
      /\$reset\s*\(/,
      /\$subscribe\s*\(/,
      /\$dispose\s*\(/,

      // Internal implementation details
      /\._p/,
      /\._s/,
      /\._e/,
      /\._a/,
      /\$state/,
      /\$id/,

      // Common error messages
      /store.*not.*found/i,
      /pinia.*not.*installed/i,
      /invalid.*store/i,
      /action.*not.*found/i,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Standard filenames
      /(?:p|pi|pin)ia(?:\.min)?\.js$/i,
      /pinia\/dist/i,
      /pinia-\w+\.js$/i,

      // Build output patterns
      /\b(?:pinia|store)\.[a-f0-9]+\.js$/i,

      // Common Pinia-related filenames
      /stores?\.?\w*\.js$/i,
      /stores?\/\w+\.js$/i,
      /use[A-Z]\w+Store\.js$/i,
      /[a-z]+Store\.js$/i,

      // Common Vue/Pinia patterns
      /\.store\./i,
      /store\.setup\./i,
      /composables?\//i,

      // Vendor chunks
      /vendors?[-~.]\w*\.js$/i,
      /commons[-~.]\w*\.js$/i,
      /main[-~.]\w*\.js$/i,
    ],
  },
];
