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

export const recoil = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Recoil's unique internal global property
      /\$\$isRecoilValue/,

      // Recoil's internal cache keys that survive minification
      /\["ROOT_QUERY"\]|\["ROOT_MUTATION"\]/,

      /Recoil selector has circular dependencies:/,

      // Recoil's internal cache keys that survive minification
      /"RECOIL_GKS_ENABLED"/,

      // Unique Recoil error messages from actual implementation
      /"Cannot use server actions in pages\/api\/"/,
    ],
  },
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    scripts: [
      // Recoil's unique atom family pattern
      /function\s+atomFamily\s*\(\s*\{\s*key\s*:[^,]+,\s*default\s*:/,

      // Recoil's specific core initialization
      /function\s+RecoilRoot\s*\(\s*\{\s*(?:initializeState|override)\s*:/,

      // Unique atom error messages that survive minification
      /"Duplicate atom key \\"[^"]+\\". This is a FATAL ERROR"/,
      /"Missing definition for RecoilValue: \\"[^"]+\\""/,

      // Unique Recoil validation messages from implementation
      /"Multiple Content-Length".*"both multipart and urlencoded"/,
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

        const globalObj = window;

        return !!(
          globalObj.__RECOIL_STATE__ ||
          globalObj.__RECOIL_DEVTOOLS_EXTENSION__ ||
          globalObj.__RECOIL_DEBUG_LABEL_MAP__ ||
          Object.values(globalObj).some(isRecoilValue)
        );
      });
    },
  },
];
