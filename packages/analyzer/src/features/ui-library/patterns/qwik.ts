import { Page } from 'playwright';

export const qwik = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Qwik imports and runtime
      /from\s+["']@builder\.io\/qwik["']/,
      /qwikloader/,
      /qInit\s*\(/,
      /qwik\/build/,
      // Qwik runtime markers
      /q:container/,
      /q:version/,
      /q:base/,
      // Common minified patterns
      /__q_context__/,
      /QWIK\s+\d+/,
      /\bQRL\b/,
    ],
  },
  {
    name: 'rendering' as const,
    score: 0.3,
    runtime: [
      // Core rendering
      /q:render/,
      /q:slot/,
      /q:template/,
      // Hydration markers
      /q:id/,
      /q:key/,
      /q:host/,
      // Resource loading
      /q:load/,
      /q:watch/,
      /on:qvisible/,
    ]
  },
  {
    name: 'components' as const,
    score: 0.25,
    runtime: [
      // Component patterns
      /component\$\s*\(/,
      /useTask\$\s*\(/,
      /useSignal\s*\(/,
      /useStore\s*\(/,
      /useResource\$\s*\(/,
      /useClientEffect\$\s*\(/,
      // Props and slots
      /Slot\s*\(/,
      /useContext\s*\(/,
      /createContextId\s*\(/,
    ]
  },
  {
    name: 'optimization' as const,
    score: 0.2,
    runtime: [
      // Lazy loading
      /\.lazy/,
      /noSerialize/,
      // Prefetching
      /prefetchEvent/,
      /prefetchUrlCacheBust/,
      // Event optimization
      /on:click\$/,
      /on:input\$/,
      /preventdefault:/,
    ]
  },
  {
    name: 'serverPatterns' as const,
    score: 0.15,
    runtime: [
      // Server$ functions
      /server\$\s*\(/,
      /routeLoader\$/,
      /routeAction\$/,
      /validator\$/,
      // Qwik City
      /qwik-city/,
      /qwik\/city/,
      /useLocation\s*\(/,
      /useNavigate\s*\(/,
    ]
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Qwik global
          hasQwikGlobal: typeof (window as any).QWIK !== 'undefined',
          // Check for Qwik container
          hasQwikContainer: !!document.querySelector('[q\\:container]'),
          // Check for Qwik version marker
          hasQwikVersion: !!document.querySelector('[q\\:version]'),
          // Check for Qwik base
          hasQwikBase: !!document.querySelector('[q\\:base]'),
          // Check for Qwik loader script
          hasQwikLoader: !!document.querySelector('script[id="qwikloader"]'),
          // Check for Qwik context
          hasQwikContext: !!(window as any).__q_context__,
          // Check for Qwik events
          hasQwikEvents: !!(window as any).__qwik_listener_count,
        };
        return Object.values(markers).some(Boolean);
      });
    }
  },
];
