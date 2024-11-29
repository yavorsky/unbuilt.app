import { Page } from "playwright";

export const solid = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Solid
      /from\s+["']solid-js["']/,
      /createSignal\s*\(/,
      /createEffect\s*\(/,
      /createMemo\s*\(/,
      // Solid runtime markers
      /_$HY/,
      /_\$HY/,
      /\$PROXY/,
      // Common minified patterns
      /\._\$/,
      /\.\$/,
      /\$\$/,
    ],
  },
  {
    name: 'rendering' as const,
    score: 0.3,
    runtime: [
      // Core rendering
      /render\s*\(\s*\(\s*\)\s*=>/,
      /hydrate\s*\(\s*\(\s*\)\s*=>/,
      // DOM markers
      /data-hk/,
      /data-dk/,
      // Solid DOM
      /from\s+["']solid-js\/web["']/,
      /createComponent\s*\(/,
      /insert\s*\(/,
      /template\s*\(/,
    ]
  },
  {
    name: 'reactivity' as const,
    score: 0.25,
    runtime: [
      // Core reactive primitives
      /createSignal|createEffect|createMemo/,
      /createResource|createStore|createRoot/,
      // Reactive utilities
      /untrack|batch|on/,
      /createComputed/,
      /onMount|onCleanup/,
      // Store patterns
      /produce\s*\(/,
      /reconcile\s*\(/,
    ]
  },
  {
    name: 'components' as const,
    score: 0.25,
    runtime: [
      // Component patterns
      /createComponent\s*\(/,
      /splitProps\s*\(/,
      /mergeProps\s*\(/,
      /children\s*\(/,
      // Control flow
      /For\s*\{/,
      /Show\s*\{/,
      /Switch\s*\{/,
      /Match\s*\{/,
      /Index\s*\{/,
      /ErrorBoundary\s*\{/,
      /Suspense\s*\{/,
      /Portal\s*\{/,
    ]
  },
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // JSX runtime
      /\$template\$/,
      /\$custom\$/,
      // Compiler output
      /_tmpl\$/,
      /_\$template/,
      // Dynamic imports
      /lazy\s*\(/,
      /defer\s*\(/,
      // Resource patterns
      /loadResource/,
      /refetchResource/,
    ]
  },
  {
    name: 'stores' as const,
    score: 0.15,
    runtime: [
      // Store API
      /createStore\s*\(/,
      /produce\s*\(/,
      /reconcile\s*\(/,
      // Store utilities
      /unwrap\s*\(/,
      /getOwner\s*\(/,
      /runWithOwner\s*\(/,
      // Store patterns
      /\[\$\$\]/,
      /\$\$self/,
    ]
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasReactiveMarkers: !!window._$HY,
          hasHydrationMarkers: !!document.querySelector('[data-hk],[data-dk]'),
          hasTemplateMarkers: !!document.querySelector('template[data-type="text/hyperscript"]'),
          hasSolidMarkers: !!document.querySelector('[data-solid]'),
          hasComponentMarkers: !!document.querySelector('[_$HY]')
        };
        return Object.values(markers).some(Boolean);
      });
    }
  },
];
