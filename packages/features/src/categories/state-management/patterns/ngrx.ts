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
    scripts: [
      // NgRx's unique injection tokens that survive minification
      /"@ngrx\/store\/init"/,
      /"@ngrx\/store Internal Root Guard"/,
      /"@ngrx\/store Internal Initial State"/,
      /"@ngrx\/store Initial State"/,

      // NgRx's specific update action type
      /"@ngrx\/store\/update-reducers"/,

      // NgRx's internal state property names
      /\["\$\$isNgrxMockEnvironment"\]/,
      /\["\$ngrxMockState"\]/,

      // NgRx's unique error messages
      /"The root Store has been provided more than once. Feature modules should provide feature states instead."/,
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
    name: 'storeFeatures' as const,
    score: 0.8,
    scripts: [
      // NgRx's unique store feature injection tokens
      /"@ngrx\/store Store Features"/,
      /"@ngrx\/store Internal Store Features"/,
      /"@ngrx\/store Feature Reducers"/,

      // NgRx's unique metadata keys
      /"@ngrx\/store\/metaReducers"/,
      /"@ngrx\/store\/reducers"/,
    ],
  },
  {
    name: 'effects' as const,
    score: 0.3,
    scripts: [
      // NgRx's unique effect creation patterns
      /function\s+createEffect\s*\(\s*source\$\s*,\s*config\)\s*\{\s*return\s*source\$\.pipe\s*\(/,

      // NgRx's specific effect registration
      /\w+\s*=\s*createEffect\s*\(\s*\(\s*\)\s*=>\s*this\.\w+\$\.pipe\s*\(/,

      // NgRx's unique effect decorator implementation
      /function\s+Effect\s*\(\s*\)\s*\{\s*return\s*function\s*\(\s*target\s*,\s*propertyName\s*\)\s*\{/,
    ],
  },
  {
    name: 'moduleImports' as const,
    score: 0.7,
    scripts: [
      // NgRx module imports
      /["']\@ngrx\/store["']/,
      /["']\@ngrx\/effects["']/,
      /["']\@ngrx\/entity["']/,
      /["']\@ngrx\/store-devtools["']/,
    ],
  },
];
