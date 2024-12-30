import { Page } from 'playwright';

export const redux = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    scripts: [
      // Redux's unique store implementation with currentReducer and currentState
      /function\s+createStore\s*\([^)]*\)\s*\{\s*(?:var|let|const)\s+currentReducer\s*=\s*reducer(?:\s*;)?\s*(?:var|let|const)\s+currentState\s*=\s*preloadedState/,

      // Redux's unique isPlainObject check used internally
      /function\s+isPlainObject\s*\(obj\)\s*\{\s*if\s*\(typeof\s+obj\s*!==\s*['"]object['"]\s*\|\|\s*obj\s*===\s*null\)\s*return\s*false/,

      // Redux's specific store enhancer pattern
      /if\s*\(typeof\s+enhancer\s*!==\s*['"]undefined['"]\)\s*\{\s*if\s*\(typeof\s+enhancer\s*!==\s*['"]function['"]\)\s*\{\s*throw/,

      // Redux's unique action type validation
      /if\s*\(\s*typeof\s+action\.type\s*===\s*['"]undefined['"]\s*\)\s*\{\s*throw\s+new\s+Error\s*\(['"](Actions|Reducers)[^'"]*['"]\)/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- No need to typecheck window keys
        const hasReduxStore = (obj: any) => {
          return (
            obj &&
            typeof obj.dispatch === 'function' &&
            typeof obj.subscribe === 'function' &&
            typeof obj.getState === 'function' &&
            typeof obj.replaceReducer === 'function' &&
            // Check for Redux-specific store implementation details
            obj.dispatch.toString().includes('currentState') &&
            // @ts-expect-error Symbol type is not recognized by TypeScript in node env
            typeof obj[Symbol.observable] === 'function'
          );
        };

        const hasReduxDevTools = !!(
          window.__REDUX_DEVTOOLS_EXTENSION__?.connect &&
          window.__REDUX_DEVTOOLS_EXTENSION__.connections &&
          window.__REDUX_DEVTOOLS_EXTENSION__.send
        );

        return hasReduxDevTools || Object.values(window).some(hasReduxStore);
      });
    },
  },
  {
    name: 'toolkit' as const,
    score: 0.3,
    scripts: [
      // RTK's unique createSlice implementation details
      /createSlice\s*\(\s*\{\s*name:\s*[^,]+,\s*initialState:[^,]+,\s*reducers:\s*\{[\s\S]*\}\s*\}\)/,

      // RTK's specific Immer integration pattern
      /produce\s*\(\s*state\s*,\s*(?:function\s*\([^)]*\)|[^,]+)\s*=>\s*\{\s*state\./,

      // RTK's unique createEntityAdapter implementation
      /createEntityAdapter\s*\(\s*\{\s*selectId:\s*(?:function\s*\([^)]*\)|[^,]+)\s*=>\s*[^,]+(?:,\s*sortComparer:\s*(?:function\s*\([^)]*\)|[^}]+))?\s*\}\)/,
    ],
  },
  {
    name: 'reactRedux' as const,
    score: 0.3,
    scripts: [
      // React-Redux's unique Subscription implementation
      /function\s+createSubscription\s*\(store\)\s*\{\s*(?:var|let|const)\s+unsubscribe\s*;\s*function\s+onStateChange\s*\(\)/,

      // React-Redux's specific store validation
      /function\s+checkStoreShape\s*\(store\)\s*\{\s*(?:var|const|let)\s+missingMethods\s*=\s*\[\s*(?:['"]getState['"],?\s*['"]dispatch['"],?\s*['"]subscribe['"]\s*)*\]\.filter\(/,

      // React-Redux's unique batch implementation
      /function\s+batch\s*\(callback\)\s*\{\s*return\s*callback\(\)\s*\}/,
    ],
  },
];
