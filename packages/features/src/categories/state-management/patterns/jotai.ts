import { Page } from 'playwright';

export const jotai = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Jotai imports (includes minified variants)
      /["'](?:j|jo|jot)ai["']/,
      /["'](?:j|jo|jot)ai\/(?:utils|devtools|babel)["']/,

      // Core atom functions that survive minification
      /atom\s*\(/,
      /atomWith\w+\s*\(/,
      /useAtom\s*\(/,
      /useAtomValue\s*\(/,
      /useSetAtom\s*\(/,
      /useAtomCallback\s*\(/,

      // Provider and utils
      /Provider\s*(?:value|store)?\s*=/,
      /atomFamily\s*\(/,
      /selectAtom\s*\(/,
      /splitAtom\s*\(/,

      // Internal Jotai markers
      /__JOTAI__/,
      /\$jotai/,
      /RESET/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Jotai DevTools
          hasDevTools:
            !!window.__JOTAI_DEVTOOLS_EXTENSION__ ||
            !!window.__JOTAI_DEBUG__ ||
            !!window.__JDT__,

          // Check for store
          hasStore:
            !!window.__JOTAI__ || !!window.__JOT__ || !!window.jotaiStore,

          // Check for Provider
          hasProvider: !!window.JotaiProvider || !!window.jotaiProvider,

          // Check for internal APIs
          hasApi:
            typeof window.createStore === 'function' ||
            typeof window.atom === 'function',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Atom creation and usage patterns
      /atom\s*\(\s*null\)/,
      /atom\s*\(\s*\(get\)\s*=>/,
      /atomWith\w+\s*\(\s*[\w\d]+\s*,/,

      // Common utility patterns
      /get\s*\(\s*\w+Atom\)/,
      /scope\s*\(/,
      /loadable\s*\(/,

      // Internal implementation details
      /\._value/,
      /\._promise/,
      /\._mounted/,
      /\._listeners/,
      /\._debugLabel/,
      /\._registry/,

      // Common error messages and debug patterns
      /atom.*not.*found/i,
      /invalid.*atom/i,
      /cannot.*read.*value/i,
      /debugLabel:/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Standard filenames
      /(?:j|jo|jot)ai(?:\.min)?\.js$/i,
      /jotai\/(?:utils|devtools|babel)/i,
      /jotai-\w+\.js$/i,

      // Build output patterns
      /\b(?:jotai|atom)\.[a-f0-9]+\.js$/i,

      // Common Jotai-related filenames
      /atoms?\.?\w*\.js$/i,
      /atoms?\/\w+\.js$/i,
      /use[A-Z]\w+Atom\.js$/i,
      /[a-z]+Atom\.js$/i,

      // Vendor chunks that might contain Jotai
      /vendors?[-~.]\w*\.js$/i,
      /commons[-~.]\w*\.js$/i,
      /main[-~.]\w*\.js$/i,
    ],
  },
];
