import { Page } from 'playwright';

// Pinia store internal types
interface PiniaStoreState {
  state: Record<string, unknown>;
  stores: Record<string, unknown>;
}

interface PiniaInternals {
  _p: PiniaStoreState;
}

// Pinia store public API
interface PiniaStoreMethods {
  $reset: () => void;
  $state: Record<string, unknown>;
  $subscribe: (callback: () => boolean, options?: unknown) => void;
}

// Combined type for store detection
interface PiniaStore extends PiniaStoreMethods, PiniaInternals {}

export const pinia = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    scripts: [
      // Pinia's unique store creation pattern
      /function\s+defineStore\s*\(\s*idOrOptions\s*,\s*setup\s*,\s*setupOptions\s*\)\s*\{\s*let\s+id\s*;?\s*let\s+options;?\s*(?:const|let|var)\s+isSetupStore/,

      // Pinia's specific store setup implementation
      /function\s+createOptionsStore\s*\(\s*id\s*,\s*options\s*,\s*pinia\s*,\s*hot\s*\)\s*\{\s*(?:const|let|var)\s+store\s*=\s*reactive/,

      // Pinia's unique plugin system implementation
      /function\s+createPinia\s*\(\s*\)\s*\{\s*(?:const|let|var)\s+scope\s*=\s*effectScope\s*\(true\)/,

      // Pinia's specific state management
      /function\s+patchObject\s*\(\s*(?:state|source|target)\s*,\s*(?:state|source|target)\s*,\s*(?:store|replaced)\s*\)\s*\{/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const isPiniaStore = (obj: unknown): obj is PiniaStore => {
          if (!obj || typeof obj !== 'object') {
            return false;
          }

          const store = obj as Partial<PiniaStore>;

          // Check for required public API methods
          const hasPublicApi =
            typeof store.$reset === 'function' &&
            typeof store.$subscribe === 'function' &&
            store.$state !== undefined;

          // Check for internal store properties
          const hasInternals =
            store._p &&
            typeof store._p === 'object' &&
            'state' in store._p &&
            'stores' in store._p &&
            typeof store._p.stores === 'object';

          return !!(hasPublicApi && hasInternals);
        };

        // Type-safe window access
        const globalObj = window as Window & {
          __PINIA__?: unknown;
          __PINIA_DEVTOOLS_GLOBAL_HOOK__?: unknown;
        };

        return !!(
          globalObj.__PINIA__ ||
          globalObj.__PINIA_DEVTOOLS_GLOBAL_HOOK__ ||
          Object.values(globalObj).some(isPiniaStore)
        );
      });
    },
  },
  {
    name: 'storeFeatures' as const,
    score: 0.3,
    scripts: [
      // Pinia's unique state subscription system
      /function\s+addSubscription\s*\(\s*(?:subscriptions|store)\s*,\s*callback\s*,\s*detached\s*,\s*onCleanup\s*\)\s*\{\s*(?:const|let|var)\s+removeSubscription/,

      // Pinia's specific store reset implementation
      /\$reset\s*:\s*function\s*\(\s*\)\s*\{\s*(?:const|let|var)\s+store\s*=\s*this\s*;\s*store\.\$patch\s*\(\s*\(state\)\s*=>/,

      // Pinia's unique store $patch implementation
      /\$patch\s*:\s*function\s*\(\s*partialStateOrMutator\s*\)\s*\{\s*(?:let|const|var)\s+subscriptionMutation/,
    ],
  },
  {
    name: 'devtools' as const,
    score: 0.3,
    scripts: [
      // Pinia's unique devtools integration
      /function\s+addStoreToDevtools\s*\(\s*app\s*,\s*store\s*\)\s*\{\s*if\s*\(typeof\s*window\s*!==\s*['"]undefined['"]/,

      // Pinia's specific state tracking for devtools
      /function\s+formatDisplay\s*\(\s*display\s*\)\s*\{\s*return\s*\{\s*_custom:\s*\{\s*display\s*\}/,

      // Pinia's unique devtools hook pattern
      /\$subscribe\s*\(\s*callback\s*,\s*options\s*\)\s*\{\s*(?:const|let|var)\s+removeSubscription\s*=\s*addSubscription/,
    ],
  },
];
