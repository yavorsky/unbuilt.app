import { Page } from 'playwright';

export const react = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // React core
      /(?:window\.)?React/,
      /__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED/,
      /(?:["'])(?:react|react-dom)(?:["'])/,
      /\$\$typeof|Symbol\.for\(["']react\./,
      // React internals
      /_reactListening/,
      /__reactFiber/,
      /__reactProps/,
      /__reactContainer/,
      /_reactRootContainer/,
      /\._reactInternals/,
      // Common minified patterns
      /\.__r|\$r|\$R/,
      /_react[A-Z]/,
    ],
  },
  {
    name: 'rendering' as const,
    score: 0.3,
    runtime: [
      // React DOM
      /ReactDOM(?:\.|\[)/,
      /(?:render|hydrate|createRoot)\s*\(/,
      /hydrateRoot\s*\(/,
      // React 18 specific
      /createRoot\s*\(/,
      /reactDom\.production\.min\.js/,
      // Server markers
      /data-reactroot/,
      /data-react-hydrated/,
      /reactjs\.linked/,
      /react-mount/,
    ],
  },
  {
    name: 'jsxCompiled' as const,
    score: 0.25,
    runtime: [
      // JSX runtime
      /jsx\s*=\s*react\.jsx/,
      /_jsx\(/,
      /_jsxs\(/,
      /_jsxDEV\(/,
      /jsxDEV\(/,
      /jsx\(/,
      /jsxs\(/,
      // JSX properties
      /jsxRuntime/,
      /jsxFileName/,
      /jsxSourceLoc/,
      // Common build patterns
      /\[\s*"ref"\s*,\s*null\s*,/,
      /\[\s*"key"\s*,\s*null\s*,/,
    ],
  },
  {
    name: 'hooks' as const,
    score: 0.25,
    runtime: [
      // Core hooks
      /(?:React\.|[\W])use(?:State|Effect|Context|Reducer|Ref)\W/,
      // Additional hooks
      /(?:React\.|[\W])use(?:Callback|Memo|ImperativeHandle|LayoutEffect)\W/,
      // React 18 hooks
      /(?:React\.|[\W])use(?:Transition|DeferredValue|Id|SyncExternalStore)\W/,
      // Hook internals
      /(?:React\.|[\W])use(?:DebugValue|InsertionEffect)\W/,
      /dispatcher\s*=\s*ReactCurrentDispatcher/,
      /__react_hooks__/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.2,
    runtime: [
      // Core component APIs
      /React\.(?:Component|PureComponent|Fragment)/,
      /(?:React\.|[\W])(?:memo|lazy|Suspense|forwardRef)\(/,
      /(?:React\.|[\W])(?:StrictMode|Profiler)\W/,
      // Component internals
      /\.__proto__\s*=\s*React\.Component/,
      /\.contextTypes|\.propTypes|\.defaultProps|\.displayName/,
      /\.\$\$typeof\s*=|\.\$\$typeof:/,
      /\._owner=/,
      // Error boundaries
      /componentDidCatch|getDerivedStateFromError/,
    ],
  },
  {
    name: 'reconciler' as const,
    score: 0.15,
    runtime: [
      // React Fiber
      /__reactFiber/,
      /ReactCurrentOwner/,
      /ReactCurrentDispatcher/,
      /ReactCurrentBatchConfig/,
      // Event system
      /__reactEvents/,
      /attachEvent/,
      /capturePhase/,
      // Scheduler
      /Scheduler\.unstable_/,
      /unstable_scheduleCallback/,
      /requestIdleCallback/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasReact: typeof window.React !== 'undefined',
          hasReactDOM: typeof window.ReactDOM !== 'undefined',
          hasDispatcher:
            !!window.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
          // Check for React root
          hasReactRoot: !!document.querySelector('[data-reactroot]'),
          // Check for React devtools hook
          hasDevTools: !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'ssr' as const,
    score: 0.2,
    browser: async (page: Page) => {
      // Check for React SSR markers
      return page!.evaluate(() => {
        // Check for specific React SSR signatures
        const markers = {
          // Data-reactroot attribute indicates React SSR
          hasReactRoot: !!document.querySelector('[data-reactroot]'),

          // React hydration markers
          hasHydrationComment:
            document.documentElement.innerHTML.includes('<!--$-->'),

          // React hydration errors in console can indicate SSR
          hasHydrationError: window.__REACT_ERROR_OVERLAY__ !== undefined,

          // Check if content is present before JS loads
          hasInitialContent: document.body.children.length > 0,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
];
