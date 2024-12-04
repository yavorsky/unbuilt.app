import { Page } from 'playwright';

export const preact = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Preact
      /(?:window\.)?preact/,
      /from\s+["']preact["']/,
      // Preact internal markers
      /__preactattr_/,
      /__n/, // Common minified Preact function
      /\bh\s*\(/, // Preact's createElement equivalent
      // VNode patterns
      /\.__v/,
      /\.__k/,
      /\.__b/,
      /\.__e/,
      /\.__c/,
      // Common minified patterns
      /\$\.__/,
      /_vnodeId/,
    ],
  },
  {
    name: 'rendering' as const,
    score: 0.3,
    runtime: [
      // Rendering methods
      /render\s*\(\s*[^,]+,\s*[^,)]+\)/,
      /hydrate\s*\(\s*[^,]+,\s*[^,)]+\)/,
      // DOM markers
      /data-preact/,
      /preactroot/,
      // Preact specific attributes
      /\bkey\$|\bref\$/,
      /__self\$|__source\$/,
    ],
  },
  {
    name: 'hooks' as const,
    score: 0.25,
    runtime: [
      // Core hooks
      /(?:preact\/|[\W])use(?:State|Effect|Context|Reducer|Ref)\W/,
      // Additional hooks
      /(?:preact\/|[\W])use(?:Callback|Memo|LayoutEffect)\W/,
      // Preact-specific hooks
      /useErrorBoundary/,
      // Hook internals
      /__hooks\$?/,
      /__c\s*=\s*!/, // Common hook initialization pattern
    ],
  },
  {
    name: 'components' as const,
    score: 0.25,
    runtime: [
      // Component base
      /Component\s*\{\s*(?:render|constructor)/,
      // Component features
      /componentWillMount|componentDidMount/,
      /componentWillUnmount|componentDidUnmount/,
      /componentWillUpdate|componentDidUpdate/,
      /shouldComponentUpdate/,
      /getSnapshotBeforeUpdate/,
      // Fragment
      /Fragment\s*[,}]|Fragment:/,
      // Common patterns
      /this\.props|this\.state/,
    ],
  },
  {
    name: 'compat' as const,
    score: 0.2,
    runtime: [
      // React compatibility layer
      /preact\/compat/,
      /react-compat/,
      /prefixed\s*\(/,
      // Aliased React imports
      /(?:["'])react(?:["'])\s*:\s*(?:["'])preact\/compat(?:["'])/,
      /(?:["'])react-dom(?:["'])\s*:\s*(?:["'])preact\/compat(?:["'])/,
      // Compat features
      /createPortal/,
      /Suspense/,
      /lazy\s*\(/,
    ],
  },
  {
    name: 'signals' as const,
    score: 0.15,
    runtime: [
      // Preact Signals
      /(?:from\s+)?["']@preact\/signals["']/,
      /useSignal|useComputed/,
      /signal\s*\(/,
      /computed\s*\(/,
      /effect\s*\(/,
      /batch\s*\(/,
      // Signal internals
      /__value/,
      /__subscribers/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasPreact: typeof window.preact !== 'undefined',
          hasPreactMarkers: !!document.querySelector('[data-preact-client]'),
          hasDevTools: !!window.__PREACT_DEVTOOLS__,
          hasOptions: !!window.__PREACT_OPTIONS__,
          hasHooks: !!window.__PREACT_HOOKS__,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
