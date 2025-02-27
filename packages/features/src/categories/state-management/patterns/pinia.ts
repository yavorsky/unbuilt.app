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
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Pinia's unique Symbol and emoji prefix that survive minification
      /Symbol\(["']pinia["']\)/,
      /"🍍 Pinia \(root\)"/,
      /"🍍 "/,
      // Pinia symbol
      /const\s+\w+\s*=\s*Symbol\(\s*(?:'pinia'|"pinia")\s*\)/,

      /\w+\.config\.globalProperties\.\$pinia\s*=\s*\w+/,

      /\/\*!\s*\n\s*\*\s*pinia\s+v\d+\.\d+\.\d+/, // Pinia's version

      // Pinia's specific error messages with unique prefix
      /"\[Pinia\]: skipping hmr because store doesn't exist yet"/,

      // Pinia's specific event and mutation type strings
      /"pinia:mutations"/,
      /MutationType\.direct/,
      /MutationType\.patchFunction/,
      /MutationType\.patchObject/,
    ],
  },
  {
    name: 'coreRuntime' as const,
    score: 0.4,
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
    name: 'stateImplementation' as const,
    score: 0.8,
    scripts: [
      // Pinia's specific logo URL that survives minification
      /"https:\/\/pinia\.vuejs\.org\/logo\.svg"/,
    ],
  },
  {
    name: 'devtoolsImplementation' as const,
    score: 0.7,
    scripts: [
      // Pinia's specific devtools markers that survive minification
      /"__PINIA__"/,
      /"__PINIA_DEVTOOLS_GLOBAL_HOOK__"/,
    ],
  },
];
