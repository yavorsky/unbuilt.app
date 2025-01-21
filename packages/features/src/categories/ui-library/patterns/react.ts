import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const react = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core React object detection - highly specific to React
      /(?:window\.)?React=\{(?:[^}]+)\}/,
      /\.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED/,

      // React symbol registration - unique to React
      /Symbol\.for\(["']react\.element["']\)/,
      /Symbol\.for\(["']react\.fragment["']\)/,
      /Symbol\.for\(["']react\.forward_ref["']\)/,

      // React internal properties (minification-resistant)
      /__reactFiber[$_a-zA-Z0-9]+/, // Matches minified fiber refs
      /__reactProps[$_a-zA-Z0-9]+/, // Matches minified props
      /__reactContainer[$_a-zA-Z0-9]+/, // Matches minified container refs

      // React error codes pattern (unique to React)
      /Error\(formatProdErrorMessage\(\d+\)\)/,

      // React production minified markers
      /production\.min\.js["']\}?\)/,
      /\?react\b.*?\.production\.min\.js/,
    ],
  },
  {
    name: 'rendering' as const,
    score: 0.3,
    scripts: [
      // React 18+ specific root APIs
      /\.createRoot\([\s\S]{1,50}?\.render\(/,
      /hydrateRoot\([\s\S]{1,50}?\.render\(/,

      // React DOM specific patterns (minification-resistant)
      /\breturn\s+ReactDOM\./,
      /(?:document|container|root|element)\.querySelector\(['"]\[data-reactroot\]['"]\)/,

      // React 18 concurrent features
      /startTransition\s*\(\s*\(\s*\)\s*=>\s*\{/,
      /\.createBlockingRoot\s*\(/,

      // React hydration markers
      /data-react-hydrated=["']/,
      /hydrationData(?::\s*\{|=\{)/,
    ],
  },
  {
    name: 'jsxCompiled' as const,
    score: 0.25,
    scripts: [
      // Modern JSX Runtime (React 17+)
      /import\s*\{\s*jsx\s*(?:as\s*_jsx)?\s*\}\s*from\s*["']react\/jsx-runtime["']/,

      // JSX Development patterns (with source locations)
      /_jsxDEV\s*\(\s*[A-Za-z_$][\w$]*\s*,\s*\{/,
      /_jsxFileName\s*:\s*["'][^"']+["']/,

      // Production JSX patterns
      /_jsx\s*\(\s*[A-Za-z_$][\w$]*\s*,\s*\{/,
      /_jsxs\s*\(\s*[A-Za-z_$][\w$]*\s*,\s*\{/,

      // Classic JSX transform
      /React\.createElement\s*\(\s*[A-Za-z_$][\w$]*\s*,\s*\{/,
    ],
  },
  {
    name: 'hooks' as const,
    score: 0.25,
    scripts: [
      // Hook definitions (minification resistant)
      /function\s+useState\s*\(\s*[a-zA-Z_$][\w$]*\s*\)\s*\{/,
      /function\s+useEffect\s*\(\s*[a-zA-Z_$][\w$]*\s*,\s*\[/,

      // React 18+ hooks with specific patterns
      /useTransition\s*\(\s*\)\s*\{\s*(?:return\s+)?(?:React\._currentRenderer|dispatcher)/,
      /useDeferredValue\s*\(\s*[a-zA-Z_$][\w$]*\s*\)\s*\{/,

      // Hook internal markers (highly specific to React)
      /__react_hooks__[$_a-zA-Z0-9]+/,
      /dispatcher\s*=\s*ReactCurrentDispatcher\.current/,

      // Custom hooks pattern (following React conventions)
      /function\s+use[A-Z]/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.2,
    scripts: [
      // Class components (with inheritance)
      /class\s+[A-Za-z_$][\w$]*\s+extends\s+(?:React\.)?Component\s*\{/,
      /class\s+[A-Za-z_$][\w$]*\s+extends\s+(?:React\.)?PureComponent\s*\{/,

      // Higher-order components
      /(?:React\.|[\W])memo\s*\(\s*(?:function|class|_)/,
      /(?:React\.|[\W])forwardRef\s*\(\s*(?:function|class|_)/,

      // Error boundary methods
      /(?:static\s+)?getDerivedStateFromError\s*\(\s*error\s*\)\s*\{/,
      /componentDidCatch\s*\(\s*error\s*,\s*errorInfo\s*\)\s*\{/,
    ],
  },
  {
    name: 'reconciler' as const,
    score: 0.15,
    scripts: [
      // Fiber reconciler (unique to React)
      /__reactFiber[$_a-zA-Z0-9]+/,
      /ReactCurrentOwner\s*=\s*\{/,
      /ReactCurrentDispatcher\s*=\s*\{/,

      // React 18 concurrent features
      /ReactCurrentBatchConfig\s*=\s*\{/,
      /Scheduler\.unstable_scheduleCallback/,

      // React event system (specific to React)
      /__reactEvents[$_a-zA-Z0-9]+/,
      /reactEventHandlers[$_a-zA-Z0-9]+/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for React global object with specific properties
          hasReact:
            typeof window.React === 'object' &&
            !!window.React.createElement &&
            !!window.React.Component,

          // Check for ReactDOM with modern APIs
          hasReactDOM:
            typeof window.ReactDOM === 'object' &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Older version of react dom
            (!!(window.ReactDOM as any).createRoot || !!window.ReactDOM.render),

          // Check for React internals (highly specific)
          hasInternals:
            typeof window.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED ===
            'object',

          // Check for React DevTools
          hasDevTools:
            typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object',

          // Check for React root mount point
          hasReactRoot: !!document.querySelector(
            '[data-reactroot], [data-react-hydrated]'
          ),

          // Check for React Fiber root
          hasFiberRoot: Object.keys(window).some((key) =>
            key.startsWith('__reactContainer')
          ),
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
  {
    name: 'ssr' as const,
    score: 0.2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for React SSR root
          hasReactRoot: !!document.querySelector('[data-reactroot]'),

          // Check for React hydration markers (specific to React)
          hasHydrationComment:
            document.documentElement.innerHTML.includes('<!--$-->') ||
            document.documentElement.innerHTML.includes('<!--/*-->'),

          // Check for React hydration data attributes
          hasHydrationMarkers: !!document.querySelector(
            '[data-react-hydrated]'
          ),

          // Check for SSR streaming markers
          hasStreamingMarkers:
            document.documentElement.innerHTML.includes('<!--$?-->') ||
            document.documentElement.innerHTML.includes('<!--$!-->'),

          // Check for React error overlay (SSR specific)
          hasErrorOverlay:
            typeof window.__REACT_ERROR_OVERLAY__ !== 'undefined',
        };

        // Require at least two SSR markers for confidence
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
  {
    name: 'isNextJs' as const,
    score: 1,
    dependencies: (analysis: AnalysisFeatures) => {
      return analysis.framework.name === 'next';
    },
  },
];
