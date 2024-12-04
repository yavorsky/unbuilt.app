import { Page } from 'playwright';

export const ngrx = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core NgRx imports (includes minified variants)
      /["']@ngrx\/store["']/,
      /["']@ngrx\/(?:effects|entity|component-store|data|router-store)["']/,

      // Store setup patterns
      /StoreModule\.forRoot\s*\(/,
      /StoreModule\.forFeature\s*\(/,
      /EffectsModule\.forRoot\s*\(/,
      /EffectsModule\.forFeature\s*\(/,

      // Core decorators and functions
      /createEffect\s*\(\s*\(\s*\)/,
      /createAction\s*\(/,
      /createReducer\s*\(/,
      /createFeatureSelector\s*\(/,
      /createSelector\s*\(/,

      // Internal NgRx markers
      /__NGRX_STORE__/,
      /__REDUX_DEVTOOLS_EXTENSION__/,
      /STORE_DEVTOOLS/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for NgRx Store
          hasStore:
            !!window.__NGRX_STORE__ || !!window.__STORE__ || !!window.ngrxStore,

          // Check for Redux DevTools integration
          hasDevTools:
            !!window.__REDUX_DEVTOOLS_EXTENSION__ || !!window.__NGRX_DEVTOOLS__,

          // Check for Effects
          hasEffects: !!window.__NGRX_EFFECTS__ || !!window.__EFFECTS__,

          // Check for Router Store
          hasRouter: !!window.__NGRX_ROUTER__ || !!window.__ROUTER_STORE__,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Action patterns
      /props<\{[^}]+\}>\(\)/,
      /on\s*\([^,]+,\s*\([^)]+\)\s*=>/,
      /dispatch\s*\(/,
      /type:\s*['"][A-Z\s[\]]+['"]/,

      // Effect patterns
      /createEffect\s*\(\s*\(\)/,
      /ofType\s*\(/,
      /\pipe\s*\(/,
      /mergeMap\s*\(/,
      /switchMap\s*\(/,
      /exhaustMap\s*\(/,

      // Entity patterns
      /EntityState/,
      /EntityAdapter/,
      /createEntityAdapter/,

      // Internal implementation details
      /\._state/,
      /\._reducers/,
      /\._effects/,
      /\._actions/,

      // Common error messages
      /action.*must.*have.*type/i,
      /reducer.*not.*found/i,
      /effect.*not.*found/i,
      /store.*not.*provided/i,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // NgRx package patterns
      /@ngrx\/\w+/,
      /ngrx-\w+\.js$/i,
      /ngrx\.[a-f0-9]+\.js$/i,

      // Common NgRx file patterns
      /(?:store|state)\.module\.ts$/i,
      /\.(?:actions|reducer|effects|selectors)\.ts$/i,
      /\.store\.ts$/i,

      // Feature module patterns
      /\+state\//i,
      /store\//i,
      /effects\//i,
      /reducers\//i,

      // Common Angular bundle patterns
      /main\.[a-f0-9]+\.js$/i,
      /chunk\.[a-f0-9]+\.js$/i,
      /vendor\.[a-f0-9]+\.js$/i,
      /polyfills\.[a-f0-9]+\.js$/i,
    ],
  },
];
