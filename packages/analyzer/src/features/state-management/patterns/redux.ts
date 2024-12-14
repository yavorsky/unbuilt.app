import { Page } from 'playwright';

export const redux = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Redux imports (includes minified variants)
      /["'](?:r|re|red)ux["']/,
      /["']@(?:r|re|red)uxjs\/toolkit["']/,
      /["'](?:r|re|red)ux-(?:thunk|saga|observable)["']/,

      // Common Redux functions that survive minification
      /create[Ss]tore\s*\(/,
      /configure[Ss]tore\s*\(/,
      /create[Ss]lice\s*\(/,
      /create[Rr]educer\s*\(/,
      /create[Aa]ction\s*\(/,
      /combine[Rr]educers\s*\(/,

      // React-Redux integration
      /(?:use[Ss]elector|use[Dd]ispatch|connect)\s*\(/,
      /[Pp]rovider.*[Ss]tore=/,

      // Internal Redux markers
      /__redux__/,
      /\$redux/,
      /__REDUX_DEVTOOLS_EXTENSION__/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Redux DevTools
          hasDevTools:
            !!window.__REDUX_DEVTOOLS_EXTENSION__ ||
            !!window.__RDT__ ||
            !!window.__REDUX_DEV__,

          // Check for store
          hasStore:
            !!window.__REDUX_STORE__ ||
            !!window.__RDX_STORE__ ||
            !!window.store,

          // Check for Redux namespace
          hasRedux: !!window.Redux || !!window.redux || !!window.rdx,

          // Check for React-Redux
          hasReactRedux:
            !!window.ReactRedux || !!window.reactRedux || !!window.rr,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Action patterns that survive minification
      /type:\s*["'][A-Z_]+["']/,
      /payload:/,
      /dispatch\s*\(\s*[{[]/,

      // Reducer patterns
      /(?:state\s*,\s*action)\s*=>/,
      /return\s*{\s*\.\.\.state/,
      /\[\s*action\.type\s*\]/,
      /switch\s*\(\s*action\.type\s*\)/,

      // Internal implementation details
      /\._state/,
      /\._reducers/,
      /\._actions/,
      /\._dispatch/,
      /\._subscribers/,

      // Middleware patterns
      /apply[Mm]iddleware\s*\(/,
      /thunk[Ww]ith[Ee]xtra[Aa]rgument/,

      // Common error messages
      /reducer/i,
      /dispatch/i,
      /action.*type.*required/i,
      /store.*already.*exists/i,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Standard filenames
      /(?:r|re|red)ux(?:\.min)?\.js$/i,
      /@reduxjs\/toolkit/i,
      /(?:r|re|red)ux-\w+\.js$/i,

      // Build output patterns
      /\b(?:redux|store|reducer)\.[a-f0-9]+\.js$/i,

      // Common Redux-related filenames
      /store\.?\w*\.js$/i,
      /reducer(?:s)?\.?\w*\.js$/i,
      /action(?:s)?\.?\w*\.js$/i,
      /slice(?:s)?\.?\w*\.js$/i,

      // Vendor chunks
      /vendors?[-~.]\w*\.js$/i,
      /commons[-~.]\w*\.js$/i,
      /main[-~.]\w*\.js$/i,
    ],
  },
];
