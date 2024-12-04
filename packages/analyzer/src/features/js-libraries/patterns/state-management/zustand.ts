import { Page } from 'playwright';

export const zustand = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Zustand imports (includes minified variants)
      /["'](?:z|zu|zus)tand["']/,
      /["'](?:z|zu|zus)tand\/(?:middleware|vanilla|devtools)["']/,

      // Core Zustand functions that survive minification
      /create\s*\(\s*\(?(?:set|get)\)?/,
      /createStore\s*\(/,
      /useStore\s*\(/,
      /setState\s*\(/,
      /getState\s*\(/,

      // Middleware patterns
      /persist\s*\(/,
      /devtools\s*\(/,
      /immer\s*\(/,
      /subscribeWithSelector\s*\(/,

      // Internal Zustand markers
      /__ZUSTAND__/,
      /\$zustand/,
      /createImpl/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Zustand DevTools
          hasDevTools:
            !!window.__ZUSTAND_DEVTOOLS_EXTENSION__ ||
            !!window.__ZUSTAND_DEV__ ||
            !!window.__ZDT__,

          // Check for store
          hasStore:
            !!window.__ZUSTAND__ || !!window.__ZUS__ || !!window.zustandStore,

          // Check for persist middleware
          hasPersist:
            !!window.zustandPersist ||
            !!window.__ZUSTAND_PERSIST__ ||
            !!window.__ZUS_PERSIST__,

          // Check for internal APIs
          hasApi:
            typeof window.createStore === 'function' ||
            typeof window.create === 'function',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Store creation and usage patterns
      /set\s*\(\s*\(?state\)?/,
      /get\s*\(\s*\)/,
      /subscribe\s*\(/,
      /produce\s*\(/,

      // Common state update patterns
      /set\s*\(\s*\(state\)\s*=>\s*\({/,
      /set\s*\(\s*\(state\)\s*=>\s*produce/,
      /produce\s*\(\s*state/,

      // Internal implementation details
      /\._listeners/,
      /\._state/,
      /\._hasHydrated/,
      /\._persist/,

      // Common error messages
      /selector/i,
      /middleware/i,
      /store.*already.*exists/i,
      /cannot.*set.*state/i,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Standard filenames
      /(?:z|zu|zus)tand(?:\.min)?\.js$/i,
      /zustand\/middleware/i,
      /zustand\/vanilla/i,

      // Build output patterns
      /\b(?:zustand|store)\.[a-f0-9]+\.js$/i,

      // Common Zustand-related filenames
      /store\.?\w*\.js$/i,
      /stores?\/\w+\.js$/i,
      /use[A-Z]\w+Store\.js$/i,
      /[a-z]+Store\.js$/i,

      // Vendor chunks
      /vendors?[-~.]\w*\.js$/i,
      /commons[-~.]\w*\.js$/i,
      /main[-~.]\w*\.js$/i,
    ],
  },
];
