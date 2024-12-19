import { Page } from 'playwright';

// Zustand store types
interface StoreApi<T> {
  setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
  getState: () => T;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
  destroy: () => void;
}

interface CreateStoreImpl {
  initStore?: (createState: unknown) => unknown;
  ['$$typeof']?: symbol;
}

interface ZustandStore extends StoreApi<unknown>, CreateStoreImpl {}

export const zustand = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    runtime: [
      // Zustand's unique store creation implementation
      /function\s+createStore\s*\(\s*createState\s*\)\s*\{\s*(?:let|var)\s+state;\s*(?:const|let|var)\s+listeners\s*=\s*new\s+Set\(\)/,

      // Zustand's specific setState implementation
      /function\s+setState\s*\(\s*partial\s*,\s*replace\s*\)\s*\{\s*(?:const|let|var)\s+nextState\s*=\s*typeof\s+partial\s*===\s*['"]function['"]\s*\?\s*partial\(state\)\s*:\s*partial/,

      // Zustand's unique subscription system
      /function\s+subscribe\s*\(\s*listener\s*\)\s*\{\s*listeners\.add\s*\(\s*listener\s*\);\s*return\s*\(\s*\)\s*=>\s*listeners\.delete\s*\(\s*listener\s*\)/,

      // Zustand's specific store initialization pattern
      /initStore\s*=\s*\(\s*createState\s*\)\s*=>\s*\{\s*(?:const|let|var)\s+store\s*=\s*createStore\s*\(\s*createState\s*\)/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const isZustandStore = (obj: unknown): obj is ZustandStore => {
          if (!obj || typeof obj !== 'object') {
            return false;
          }

          const store = obj as Partial<ZustandStore>;

          const hasStoreApi =
            typeof store.setState === 'function' &&
            typeof store.getState === 'function' &&
            typeof store.subscribe === 'function' &&
            typeof store.destroy === 'function';

          const hasZustandMarkers =
            store.initStore !== undefined || store['$$typeof'] !== undefined;

          return hasStoreApi && hasZustandMarkers;
        };

        return Object.values(window).some(isZustandStore);
      });
    },
  },
  {
    name: 'middleware' as const,
    score: 0.3,
    runtime: [
      // Zustand's unique middleware implementation
      /function\s+devtools\s*\(\s*fn\s*,\s*options\s*\)\s*\{\s*return\s*\(\s*set\s*,\s*get\s*,\s*api\s*\)\s*=>\s*\{\s*(?:const|let|var)\s+originalState/,

      // Zustand's specific persist middleware
      /function\s+persist\s*\(\s*config\s*,\s*options\s*\)\s*\{\s*return\s*\(\s*set\s*,\s*get\s*,\s*api\s*\)\s*=>\s*\{\s*(?:let|var|const)\s+state/,

      // Zustand's unique immer integration
      /function\s+immer\s*\(\s*config\s*\)\s*\{\s*return\s*\(\s*set\s*,\s*get\s*,\s*api\s*\)\s*=>\s*config\s*\(\s*\(\s*fn\s*\)\s*=>/,
    ],
  },
  {
    name: 'reactBindings' as const,
    score: 0.3,
    runtime: [
      // Zustand's specific selector implementation
      /function\s+shallow\s*\(\s*objA\s*,\s*objB\s*\)\s*\{\s*if\s*\(\s*Object\.is\s*\(\s*objA\s*,\s*objB\s*\)\s*\)\s*\{\s*return\s*true/,

      // Zustand's unique hook implementation
      /function\s+useStore\s*\(\s*api\s*,\s*selector\s*\)\s*\{\s*(?:const|let|var)\s+\[\s*cache\s*,\s*setCache\s*\]\s*=\s*useState\s*\(\s*\(\s*\)\s*=>\s*selector\s*\(\s*api\.getState\s*\(\s*\)\s*\)\s*\)/,

      // Zustand's specific context implementation
      /function\s+createContext\s*\(\s*\)\s*\{\s*(?:const|let|var)\s+ZustandContext\s*=\s*React\.createContext\s*\(/,
    ],
  },
];
