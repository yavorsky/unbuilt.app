import { Page } from 'playwright';

// Recoil internal types
interface RecoilAtom<T = unknown> {
  key: string;
  __recoilKey?: number;
  defaultValue: T;
}

interface RecoilSelector<T = unknown> {
  key: string;
  get: (opts: { get: () => void }) => T;
  __recoilSelector?: boolean;
}

interface RecoilStore {
  getState?: () => void;
  replaceState?: () => void;
  subscribeToTransactions?: () => void;
  addTransactionMetadata?: () => void;
}

interface RecoilGlobals {
  __RECOIL_STATE__?: RecoilStore;
  __RECOIL_DEVTOOLS_EXTENSION__?: unknown;
  __RECOIL_DEBUG_LABEL_MAP__?: Map<string, string>;
}

export const recoil = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    runtime: [
      // Recoil's unique atom creation pattern
      /function\s+atom\s*\(\s*\{\s*key\s*:\s*[^,]+,\s*default\s*:/,

      // Recoil's specific selector implementation
      /function\s+selector\s*\(\s*\{\s*key\s*:\s*[^,]+,\s*get\s*:/,

      // Recoil's unique atom family pattern
      /function\s+atomFamily\s*\(\s*\{\s*key\s*:[^,]+,\s*default\s*:/,

      // Recoil's specific core initialization
      /function\s+RecoilRoot\s*\(\s*\{\s*(?:initializeState|override)\s*:/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const isRecoilValue = (
          obj: unknown
        ): obj is RecoilAtom | RecoilSelector => {
          if (!obj || typeof obj !== 'object') {
            return false;
          }

          const value = obj as Partial<RecoilAtom & RecoilSelector>;

          return !!(
            typeof value.key === 'string' &&
            (value.__recoilKey !== undefined ||
              value.__recoilSelector !== undefined ||
              (typeof value.get === 'function' && 'defaultValue' in value))
          );
        };

        const globalObj = window as Window & RecoilGlobals;

        return !!(
          globalObj.__RECOIL_STATE__ ||
          globalObj.__RECOIL_DEVTOOLS_EXTENSION__ ||
          globalObj.__RECOIL_DEBUG_LABEL_MAP__ ||
          Object.values(globalObj).some(isRecoilValue)
        );
      });
    },
  },
  {
    name: 'stateManagement' as const,
    score: 0.3,
    runtime: [
      // Recoil's unique transaction system
      /function\s+Snapshot\s*\(\s*\)\s*\{\s*(?:const|let|var)\s+(?:store|getState|replaceState)\s*=/,

      // Recoil's specific state management
      /function\s+applyAtomValueWrites\s*\(\s*store\s*,\s*writes\s*\)\s*\{/,

      // Recoil's unique cache implementation
      /function\s+setInvalidateMemoizedSnapshot\s*\(\s*(?:store|state)\s*\)\s*\{/,
    ],
  },
  {
    name: 'hooks' as const,
    score: 0.3,
    runtime: [
      // Recoil's specific hook implementations
      /function\s+useRecoilState\s*\(\s*recoilState\s*\)\s*\{\s*(?:const|let|var)\s+\[value\s*,\s*setValue\]\s*=/,

      // Recoil's unique transaction observation
      /function\s+useRecoilTransactionObserver\s*\(\s*callback\s*\)\s*\{/,

      // Recoil's specific callback hooks
      /function\s+useRecoilCallback\s*\(\s*(?:fn|callback)\s*,\s*deps\s*\)\s*\{/,
    ],
  },
];
