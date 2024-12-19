import { Page } from 'playwright';

// Jotai internal types
interface JotaiAtom<Value = unknown> {
  init?: Value;
  read?: (get: () => void) => Value | Promise<Value>;
  write?: (get: () => void, set: () => void, update: unknown) => void;
  debugLabel?: string;
}

interface JotaiStore {
  get: (atom: JotaiAtom) => unknown;
  set: (atom: JotaiAtom, update: unknown) => void;
  sub: (atom: JotaiAtom, callback: () => void) => () => void;
}

interface JotaiGlobals {
  __JOTAI_DEBUG_LABEL_MAP__?: Map<string, string>;
  __JOTAI_DEVTOOLS_GLOBAL_HOOK__?: unknown;
}

export const jotai = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    runtime: [
      // Jotai's unique atom creation pattern
      /function\s+atom\s*\(\s*initialValue\s*,\s*read\s*,\s*write\s*\)\s*\{\s*(?:const|let|var)\s+config\s*=\s*\{\s*init:/,

      // Jotai's specific provider implementation
      /function\s+Provider\s*\(\s*\{\s*children\s*,\s*store\s*\}\s*\)\s*\{\s*(?:const|let|var)\s+providerStore\s*=\s*store\s*\|\|\s*createStore\s*\(\)/,

      // Jotai's unique derived atom pattern
      /function\s+selectAtom\s*\(\s*anAtom\s*,\s*selector\s*,\s*equalityFn\s*\)\s*\{\s*return\s*atom\s*\(/,

      // Jotai's specific store creation
      /function\s+createStore\s*\(\s*\)\s*\{\s*(?:const|let|var)\s+atomValues\s*=\s*new\s+Map/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const isJotaiAtom = (obj: unknown): obj is JotaiAtom => {
          if (!obj || typeof obj !== 'object') {
            return false;
          }

          const atom = obj as Partial<JotaiAtom>;

          return !!(
            (atom.read !== undefined || atom.init !== undefined) &&
            (atom.debugLabel === undefined ||
              typeof atom.debugLabel === 'string')
          );
        };

        const isJotaiStore = (obj: unknown): obj is JotaiStore => {
          if (!obj || typeof obj !== 'object') {
            return false;
          }

          const store = obj as Partial<JotaiStore>;

          return !!(
            typeof store.get === 'function' &&
            typeof store.set === 'function' &&
            typeof store.sub === 'function'
          );
        };

        const globalObj = window as Window & JotaiGlobals;

        return !!(
          globalObj.__JOTAI_DEBUG_LABEL_MAP__ ||
          globalObj.__JOTAI_DEVTOOLS_GLOBAL_HOOK__ ||
          Object.values(globalObj).some(
            (obj) => isJotaiAtom(obj) || isJotaiStore(obj)
          )
        );
      });
    },
  },
  {
    name: 'atomUtils' as const,
    score: 0.3,
    runtime: [
      // Jotai's unique atom utilities
      /function\s+splitAtom\s*\(\s*anAtom\s*,\s*keyExtractor\s*\)\s*\{\s*return\s*atom\s*\(/,

      // Jotai's specific focus atom implementation
      /function\s+focusAtom\s*\(\s*anAtom\s*,\s*(?:getter|focus)\s*\)\s*\{\s*return\s*atom\s*\(/,

      // Jotai's unique atom family pattern
      /function\s+atomFamily\s*\(\s*initializeAtom\s*,\s*areEqual\s*\)\s*\{\s*(?:const|let|var)\s+atoms\s*=\s*new\s+Map/,
    ],
  },
  {
    name: 'hooks' as const,
    score: 0.3,
    runtime: [
      // Jotai's specific hook implementations
      /function\s+useAtom\s*\(\s*atom\s*,\s*scope\s*\)\s*\{\s*(?:const|let|var)\s+store\s*=\s*useStore\s*\(/,

      // Jotai's unique atom value subscription
      /function\s+useAtomValue\s*\(\s*atom\s*,\s*scope\s*\)\s*\{\s*(?:const|let|var)\s+store\s*=\s*useStore\s*\(/,

      // Jotai's specific atom setter implementation
      /function\s+useSetAtom\s*\(\s*atom\s*,\s*scope\s*\)\s*\{\s*(?:const|let|var)\s+store\s*=\s*useStore\s*\(/,
    ],
  },
];
