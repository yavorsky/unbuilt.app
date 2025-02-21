import { Page } from 'playwright';

export const redux = [
  {
    name: 'coreRuntime' as const,
    score: 1,
    scripts: [
      /"@@redux\/INIT[^"]+"/,
      /"@@redux\/REPLACE[^"]+"/,
      /"@@redux\/PROBE_UNKNOWN_ACTION[^"]+"/,
      /__REDUX_DEVTOOLS_EXTENSION_COMPOSE__/,
      /__REDUX_DEVTOOLS_EXTENSION__/,
      /redux-toolkit\.js\.org\/Errors\?code=/,
      /visit https:\/\/redux\.js\.org\/Errors\?code=/,
      /Symbol\.for\(["']rtk-state-proxy-original["']\)/,
      /Symbol\.for\(["']react-redux-context["']\)/,
    ],
  },
  {
    name: 'usage' as const,
    score: 0.3,
    scripts: [
      // Redux's unique store implementation with currentReducer and currentState
      /function\s+createStore\s*\([^)]*\)\s*\{\s*(?:var|let|const)\s+currentReducer\s*=\s*reducer(?:\s*;)?\s*(?:var|let|const)\s+currentState\s*=\s*preloadedState/,

      // Redux's unique isPlainObject check used internally
      /function\s+isPlainObject\s*\(obj\)\s*\{\s*if\s*\(typeof\s+obj\s*!==\s*['"]object['"]\s*\|\|\s*obj\s*===\s*null\)\s*return\s*false/,

      // Redux's specific store enhancer pattern
      /if\s*\(typeof\s+enhancer\s*!==\s*['"]undefined['"]\)\s*\{\s*if\s*\(typeof\s+enhancer\s*!==\s*['"]function['"]\)\s*\{\s*throw/,
    ],
  },
  {
    name: 'dispatchValidation' as const,
    score: 0.8,
    scripts: [
      // Redux's unique dispatch validation error messages
      /"Actions must be plain objects\. Instead, the actual type was: '[^']+'\. You may need to add middleware"/,
      /'Actions may not have an undefined "type" property'/,
      /"Action \\"type\\" property must be a string"/,
    ],
  },
  {
    name: 'devToolsMarkers' as const,
    score: 0.7,
    scripts: [
      // Redux DevTools specific messages and formats
      /"You may not call store\.subscribe\(\) while the reducer is executing"/,
      /"Reducers may not dispatch actions"/,
      /"The slice reducer for key [^"]+ returned undefined during initialization"/,
    ],
  },
  {
    name: 'reactRedux' as const,
    score: 0.3,
    scripts: [
      // React-Redux's unique context symbol
      /Symbol\.for\(["']react-redux-context["']\)/,

      // React-Redux's specific error messages
      /"Invalid value of type .* for mapDispatchToProps argument when connecting component/,

      // React-Redux's HOC pattern with unique ref name
      /Connect\([^)]+\).*reactReduxForwardedRef/,

      // React-Redux's internal property
      /\["__reactRedux"\]/,

      // React-Redux's specific subscription handling
      /notifyNestedSubs/,

      // React-Redux's unique state sync patterns
      /\{reactReduxForwardedRef:.*getServerState:.*\}/,
    ],
  },
  {
    name: 'runtime' as const,
    score: 0.8,
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
            // Temp disabling this check to improve detection
            // obj.dispatch.toString()?.includes('currentState') &&
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
];
