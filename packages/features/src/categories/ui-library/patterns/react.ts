import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const react = [
  {
    name: 'coreRuntime',
    score: 0.9, // Highest score for React-specific internals
    scripts: [
      // React-specific internal markers that aren't used by other libraries
      /__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED/, // Unique to React, present since early versions

      // React's internal namespacing - unique to React
      /__reactFiber[$\w]+/, // React Fiber implementation detail
      /__reactContainer[$\w]+/, // React 18+ root container refs

      // React's symbol registration - specific implementation details
      /Symbol\.for\(['"]react\.[\w.]+['"]\)/,

      // React's internal property names - specific to React's implementation
      /\b(?:__reactEventHandlers|__reactProps)[$\w]+/, // Event system markers
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
      /_jsxs?\s*\(\s*[A-Za-z_$][\w$]*\s*,\s*\{/,
    ],
  },
  {
    name: 'internals',
    score: 0.4,
    scripts: [
      // Data attributes specific to React that survive minification
      /\[data-reactroot\]/,
      /data-react-hydrated/,

      // React's error boundaries pattern (unique to React)
      /__reactError[$\w]+/,

      // React's specific event system markers
      /__reactEventHandlers[$\w]+/,

      // React's scheduler markers (unique to React)
      /__scheduleUpdate/,
    ],
  },
  {
    name: 'reconciler' as const,
    score: 0.3,
    scripts: [
      // Fiber reconciler (unique to React)
      /__reactFiber[$_a-zA-Z0-9]+/,

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
    score: 1,
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

          // Check for React internals
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
    // React 19.2.0+ patterns - Added 2025-12-15
    name: 'react19Features' as const,
    score: 0.4,
    scripts: [
      // React 19 Form Actions - new primitives for form handling
      /__reactFormState[$\w]*/,
      /reactFormStatus/,

      // React 19 boundary markers
      /__reactBoundary[$\w]*/,

      // React 19 use() hook patterns
      /use\s*\(\s*(?:Promise|Context)/,

      // React 19 Actions
      /useActionState\s*\(/,
      /useFormStatus\s*\(/,
      /useOptimistic\s*\(/,
    ],
  },
  {
    name: 'isNextJs' as const,
    score: 1,
    dependencies: (analysis: AnalysisFeatures) => {
      return analysis.framework.name === 'next';
    },
  },
];
