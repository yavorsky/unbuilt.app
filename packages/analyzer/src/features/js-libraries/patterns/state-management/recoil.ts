import { Page } from 'playwright';

export const recoil = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Recoil imports (includes minified variants)
      /["'](?:r|re|rec)oil["']/,
      /["'](?:r|re|rec)oil\/(?:utils|devtools)["']/,

      // Core Recoil functions that survive minification
      /RecoilRoot/,
      /atom\s*\(/,
      /selector\s*\(/,
      /atomFamily\s*\(/,
      /selectorFamily\s*\(/,

      // Hook patterns
      /useRecoilState\s*\(/,
      /useRecoilValue\s*\(/,
      /useSetRecoilState\s*\(/,
      /useResetRecoilState\s*\(/,
      /useRecoilCallback\s*\(/,

      // Internal Recoil markers
      /__RECOIL_DEVTOOLS_EXTENSION__/,
      /__RECOIL_STATE__/,
      /RecoilEnv/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Recoil DevTools
          hasDevTools:
            !!window.__RECOIL_DEVTOOLS_EXTENSION__ ||
            !!window.__RECOIL_DEBUG__ ||
            !!window.__RDT__,

          // Check for store
          hasStore:
            !!window.__RECOIL_STATE__ ||
            !!window.__RECOIL__ ||
            !!window.recoilStore,

          // Check for environment
          hasEnv: !!window.RecoilEnv || !!window.__RECOIL_ENV__,

          // Check for core functions
          hasApi:
            typeof window.RecoilRoot === 'function' ||
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
      // Atom and selector patterns
      /default:\s*\w+/,
      /key:\s*["']\w+["']/,
      /get\s*\(\s*\{\s*get\s*\}\s*\)/,
      /set\s*\(\s*\{\s*[gs]et\s*\}\s*,/,

      // Common patterns in usage
      /waitForAll\s*\(/,
      /waitForAny\s*\(/,
      /waitForNone\s*\(/,
      /noWait\s*\(/,

      // Internal implementation details
      /\._state/,
      /\._contents/,
      /\._effects/,
      /\._loadable/,
      /\._version/,

      // Common error messages
      /duplicate.*atom/i,
      /invalid.*selector/i,
      /missing.*key/i,
      /RecoilRoot.*missing/i,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Standard filenames
      /(?:r|re|rec)oil(?:\.min)?\.js$/i,
      /recoil\/utils/i,
      /recoil-\w+\.js$/i,

      // Build output patterns
      /\b(?:recoil|atom|selector)\.[a-f0-9]+\.js$/i,

      // Common Recoil-related filenames
      /atoms?\.?\w*\.js$/i,
      /selectors?\.?\w*\.js$/i,
      /(?:atom|selector)s?\/\w+\.js$/i,
      /recoil[A-Z]\w+\.js$/i,
      /use[A-Z]\w+(?:Atom|Selector)\.js$/i,

      // Common directory patterns
      /(?:store|state)s?\/atoms?\//i,
      /(?:store|state)s?\/selectors?\//i,

      // Vendor chunks
      /vendors?[-~.]\w*\.js$/i,
      /commons[-~.]\w*\.js$/i,
      /main[-~.]\w*\.js$/i,
    ],
  },
];
