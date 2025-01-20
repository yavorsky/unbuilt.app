import { Page } from 'playwright';

export const solid = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Solid initialization (production)
      /\$PROXY\s*=\s*Symbol\(\s*["']solid-proxy["']\s*\)/,
      /_\$HY\s*=\s*\{\s*events:\s*\[/,

      // Signal creation (minified)
      /\[\s*\$\$\s*=\s*\w+\s*,\s*\$\$_\s*=\s*\w+\s*\]\s*=\s*createSignal\(/,

      // Effect registration (production)
      /createEffect\(\s*\(\s*\)\s*=>\s*\{\s*untrack\(\s*\(\s*\)\s*=>/,

      // Reactive memoization (minified)
      /createMemo\(\s*\(\s*\)\s*=>\s*\w+\(\)/,

      // Internal runtime markers (production-specific)
      /\$\$root\s*=\s*\{\s*disposables:\s*new Set\s*\}/,
      /\$\$PROXY\s*=\s*Symbol\(\)/,
    ],
  },
  {
    name: 'rendering' as const,
    score: 0.3,
    scripts: [
      // DOM rendering (production)
      /insert\s*\(\s*\w+\s*,\s*\(\s*\)\s*=>\s*\w+\.assign\(/,

      // Template creation (minified)
      /_tmpl\$\s*=\s*\[\s*\w+\(\s*["'][^"']+["']\s*\)/,

      // Component mounting (production)
      /createComponent\(\s*\w+\s*,\s*\{\s*get/,

      // Hydration markers (minified)
      /\[\s*"data-hk"\s*\]\s*=\s*\_\$HY/,
      /\[\s*"data-dk"\s*\]\s*=\s*\_\$HY/,
    ],
  },
  {
    name: 'reactivity' as const,
    score: 0.25,
    scripts: [
      // Signal system (production)
      /function\s+createSignal\s*\(\s*value\s*,\s*options\s*\)\s*\{\s*const\s+[a-zA-Z_$][0-9a-zA-Z_$]*\s*=\s*\{\s*value\s*\}/,

      // Effect tracking (minified)
      /function\s+createEffect\s*\(\s*fn\s*,\s*value\s*\)\s*\{\s*runEffect/,

      // Resource handling (production)
      /createResource\(\s*source\s*,\s*fetcher\s*,\s*options\s*\)\s*\{/,

      // Lifecycle hooks (minified)
      /onMount\(\s*\(\s*\)\s*=>\s*\{/,
      /onCleanup\(\s*\(\s*\)\s*=>\s*\{/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.25,
    scripts: [
      // Flow control components (production)
      /For\s*=\s*\{\s*each:\s*\w+\s*,\s*fallback:\s*\w+\s*\}/,
      /Show\s*=\s*\{\s*when:\s*\w+\s*,\s*fallback:\s*\w+\s*\}/,

      // Component definition (minified)
      /function\s+\w+\s*\(\s*props\s*\)\s*\{\s*return\s+createComponent\(/,

      // Prop handling (production)
      /splitProps\(\s*props\s*,\s*\[[^\]]+\]\)/,
      /mergeProps\(\s*defaults\s*,\s*props\s*\)/,
    ],
  },
  {
    name: 'compilation' as const,
    score: 0.2,
    scripts: [
      // JSX compilation output (production)
      /\$template\$\s*=\s*\w+\(\s*["'][^"']+["']\s*\)/,

      // Dynamic imports (minified)
      /lazy\(\s*\(\s*\)\s*=>\s*import\([^)]+\)\)/,

      // Template literals (production)
      /_\$template\s*=\s*\[\s*["'][^"']+["']/,

      // Resource compilation
      /loadResource\(\s*key\s*,\s*fetcher\s*\)/,
    ],
  },
  {
    name: 'stores' as const,
    score: 0.15,
    scripts: [
      // Store creation (production)
      /createStore\(\s*\{\s*\w+:\s*[^}]+\}\s*\)/,

      // Store updates (minified)
      /produce\(\s*\w+\s*,\s*draft\s*=>/,

      // Store reconciliation (production)
      /reconcile\(\s*\w+\s*,\s*\{\s*key:\s*\w+\s*\}\)/,

      // Store utilities
      /unwrap\(\s*\w+\s*,\s*\{\s*proxy:\s*true\s*\}\)/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Solid runtime with production markers
          hasRuntime: (() => {
            const solidElements = document.querySelectorAll('[data-hk]');
            return (
              solidElements.length > 0 &&
              Array.from(solidElements).some((el) =>
                el.getAttribute('data-hk')?.match(/^\d+$/)
              )
            );
          })(),

          // Check for Solid components
          hasComponents:
            document.querySelectorAll('[data-component]').length > 0,

          // Check for reactivity system
          hasReactivity:
            typeof window._$HY === 'object' &&
            Array.isArray(window._$HY.events),

          // Check for store system
          hasStores: typeof window.$PROXY === 'symbol',

          // Check for template system
          hasTemplates:
            document.querySelectorAll('template[data-solid]').length > 0,
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
];
