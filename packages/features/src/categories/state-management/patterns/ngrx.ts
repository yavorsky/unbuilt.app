import { Page } from 'playwright';

// NgRx store internal types
interface NgRxAction {
  type: string;
  __ngrx_marker?: boolean;
}

interface NgRxReducer {
  __ngrx_reducer?: boolean;
  (state: unknown, action: NgRxAction): unknown;
}

interface NgRxStore {
  dispatch: (action: NgRxAction) => void;
  select: (selector: () => void) => unknown;
  addReducer?: (feature: string, reducer: NgRxReducer) => void;
  replaceReducer?: (reducer: NgRxReducer) => void;
  ['@@observable']?: () => unknown;
}

interface NgRxGlobals {
  __ngrx_store__?: NgRxStore;
  __ngrx_effects__?: boolean;
  __ngrx_store_devtools__?: unknown;
}

export const ngrx = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    runtime: [
      // NgRx's unique store creation pattern
      /function\s+createReducerFactory\s*\([^)]*\)\s*\{\s*(?:const|let|var)\s+(?:\w+)\s*=\s*combineReducers\s*\([^)]*\)/,

      // NgRx's specific action creation pattern
      /function\s+createAction\s*\([^)]*\)\s*\{\s*return\s*(?:function\s*\([^)]*\)|[^=]+=>)\s*\{\s*return\s*\{\s*type:/,

      // NgRx's unique effect decoration
      /@Effect\s*\(\s*\)\s*\w+\$?\s*=\s*this\.actions\$\.pipe\s*\(/,

      // NgRx's specific store module implementation
      /StoreModule\.forRoot\s*\(\s*\{\s*(?:\w+\s*:\s*\w+(?:,\s*)?)*\}\s*\)/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const isNgRxStore = (obj: unknown): obj is NgRxStore => {
          if (!obj || typeof obj !== 'object') {
            return false;
          }

          const store = obj as Partial<NgRxStore>;

          return (
            typeof store.dispatch === 'function' &&
            typeof store.select === 'function' &&
            // Check for NgRx's specific store features
            (typeof store['@@observable'] === 'function' ||
              typeof store.addReducer === 'function' ||
              typeof store.replaceReducer === 'function')
          );
        };

        const globalObj = window as Window & NgRxGlobals;

        return !!(
          globalObj.__ngrx_store__ ||
          globalObj.__ngrx_effects__ ||
          globalObj.__ngrx_store_devtools__ ||
          Object.values(globalObj).some(isNgRxStore)
        );
      });
    },
  },
  {
    name: 'effects' as const,
    score: 0.3,
    runtime: [
      // NgRx's unique effect creation patterns
      /function\s+createEffect\s*\(\s*source\$\s*,\s*config\)\s*\{\s*return\s*source\$\.pipe\s*\(/,

      // NgRx's specific effect registration
      /\w+\s*=\s*createEffect\s*\(\s*\(\s*\)\s*=>\s*this\.\w+\$\.pipe\s*\(/,

      // NgRx's unique effect decorator implementation
      /function\s+Effect\s*\(\s*\)\s*\{\s*return\s*function\s*\(\s*target\s*,\s*propertyName\s*\)\s*\{/,
    ],
  },
  {
    name: 'selectors' as const,
    score: 0.3,
    runtime: [
      // NgRx's unique selector creation
      /function\s+createSelector\s*\([^)]*\)\s*\{\s*(?:const|let|var)\s+selectors\s*=\s*arguments/,

      // NgRx's specific memoization implementation
      /function\s+defaultMemoize\s*\(\s*projectFn\s*,\s*isArgumentsEqual\s*\)\s*\{\s*(?:let|var)\s+lastArguments\s*=\s*null/,

      // NgRx's unique feature selector pattern
      /createFeatureSelector\s*\(\s*['"`]\w+['"`]\s*\)/,
    ],
  },
];
