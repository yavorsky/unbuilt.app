import { Page } from 'playwright';

export const valtio = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Valtio imports (includes minified variants)
      /["'](?:v|va|val)tio["']/,
      /["'](?:v|va|val)tio\/(?:utils|vanilla|devtools)["']/,

      // Core Valtio functions that survive minification
      /proxy\s*\(/,
      /useSnapshot\s*\(/,
      /subscribe\s*\(/,
      /watch\s*\(/,
      /derive\s*\(/,
      /proxyWithComputed\s*\(/,
      /ref\s*\(/,

      // Utility functions
      /subscribeKey\s*\(/,
      /devtools\s*\(/,
      /proxyWithHistory\s*\(/,

      // Internal Valtio markers
      /__VALTIO__/,
      /\$valtio/,
      /ProxyHandlerSymbol/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Valtio DevTools
          hasDevTools:
            !!window.__VALTIO_DEVTOOLS_EXTENSION__ ||
            !!window.__VALTIO_DEV__ ||
            !!window.__VDT__,

          // Check for store/proxy
          hasStore:
            !!window.__VALTIO__ || !!window.__VAL__ || !!window.valtioStore,

          // Check for internal markers
          hasMarkers: !!window.__PROXY_STATE__ || !!window.__STATE_PROXY__,

          // Check for proxy handler
          hasProxy:
            typeof window.Proxy === 'function' &&
            !!window.__VALTIO_PROXY_HANDLER__,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Proxy usage patterns
      /new\s+Proxy\s*\(/,
      /\[\$\]/,
      /\[Symbol\.for\(['"]/,

      // Common state update patterns
      /state\.[a-zA-Z]+\s*=/,
      /snapshot\s*\(/,
      /subscribe\s*\(\s*\w+\s*,/,

      // Internal implementation details
      /\.__handlers/,
      /\.__listeners/,
      /\.__version/,
      /\.__src/,
      /\.__snapshot/,

      // Common error patterns
      /proxy.*required/i,
      /cannot.*subscribe/i,
      /invalid.*snapshot/i,
      /reference.*circular/i,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Standard filenames
      /(?:v|va|val)tio(?:\.min)?\.js$/i,
      /valtio\/(?:utils|vanilla|devtools)/i,
      /valtio-\w+\.js$/i,

      // Build output patterns
      /\b(?:valtio|proxy|state)\.[a-f0-9]+\.js$/i,

      // Common Valtio-related filenames
      /store\.?\w*\.js$/i,
      /stores?\/\w+\.js$/i,
      /proxy\.?\w*\.js$/i,
      /state\.?\w*\.js$/i,
      /use[A-Z]\w+Store\.js$/i,

      // Common directory patterns
      /stores?\/proxies?\//i,
      /stores?\/states?\//i,

      // Vendor chunks
      /vendors?[-~.]\w*\.js$/i,
      /commons[-~.]\w*\.js$/i,
      /main[-~.]\w*\.js$/i,
    ],
  },
];
