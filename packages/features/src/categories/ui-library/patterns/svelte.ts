import { Page } from 'playwright';

export const svelte = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core Svelte component initialization
      /class\s+[$_a-zA-Z][\w$]*\s+extends\s+SvelteComponent\s*\{/,
      /function\s+create_fragment\s*\([^)]*\)\s*\{(?:\s*let\s+[$_a-zA-Z][\w$]*;?)*\s*return\s*\{/,

      // Svelte component internals (minification-resistant)
      /\$\$\.(?:ctx|dirty|on_mount|on_destroy|before_update|after_update)/,
      /\$\$\.fragment\s*=\s*create_fragment/,

      // Svelte's internal property access (with proper boundaries)
      /(?:^|\W)\$\$(?:self|props|slots|events|bind)(?:\.|["']|$)/,

      // Svelte's module context
      /const\s+(?:ctx|$$scope)\s*=\s*new\s+Map/,

      // Svelte's internal functions (production patterns)
      /function\s+instance\s*\([^)]*\)\s*\{\s*let\s+[$_a-zA-Z][\w$]*\s*=\s*\{\}/,
      /function\s+mount_component\s*\([^)]*\)\s*\{/,
    ],
  },
  {
    name: 'reactivity' as const,
    score: 0.3,
    scripts: [
      // Store creation patterns (with boundaries)
      /(?:^|\W)writable\s*\(\s*(?:[^()]*)\s*\)/,
      /(?:^|\W)readable\s*\(\s*(?:[^()]*)\s*,\s*(?:start|stop)\s*=>/,
      /(?:^|\W)derived\s*\(\s*(?:[^()]*)\s*,\s*(?:\([^)]*\)|[$_a-zA-Z][\w$]*)\s*=>/,

      // Store subscription patterns
      /\$\$\.update\s*=\s*\(\)\s*=>\s*\{/,
      /\$\$\.subscribe\s*=\s*\(\s*(?:run|invalidate)\s*\)\s*=>\s*\{/,

      // Reactive statements (production)
      /\$\$\.ctx\[\d+\]\s*=\s*(?:[^;]+);(?:\s*dirty\s*\|=\s*\d+;)?/,

      // Store value access
      /get\s*\(\s*\)\s*\{\s*return\s+value\s*;\s*\}/,
      /set\s*\(\s*new_value\s*\)\s*\{\s*if\s*\(\s*safe_not_equal\s*\(\s*value\s*,\s*new_value\s*\)\s*\)/,
    ],
  },
  {
    name: 'lifecycle' as const,
    score: 0.25,
    scripts: [
      // Lifecycle hooks implementation
      /onMount\s*\(\s*(?:\(\s*\)|[$_a-zA-Z][\w$]*)\s*=>\s*\{[^}]*\}\s*\)/,
      /onDestroy\s*\(\s*(?:\(\s*\)|[$_a-zA-Z][\w$]*)\s*=>\s*\{[^}]*\}\s*\)/,

      // Update hooks with cleanup
      /beforeUpdate\s*\(\s*(?:\(\s*\)|[$_a-zA-Z][\w$]*)\s*=>\s*\{[^}]*return\s*(?:\(\s*\)|[$_a-zA-Z][\w$]*)\s*=>/,
      /afterUpdate\s*\(\s*(?:\(\s*\)|[$_a-zA-Z][\w$]*)\s*=>\s*\{[^}]*\}\s*\)/,

      // Context API implementation
      /setContext\s*\(\s*(?:["'][^"']*["']|[$_a-zA-Z][\w$]*)\s*,\s*(?:[^)]*)\s*\)/,
      /getContext\s*\(\s*(?:["'][^"']*["']|[$_a-zA-Z][\w$]*)\s*\)/,
    ],
  },
  {
    name: 'bindings' as const,
    score: 0.25,
    scripts: [
      // Action implementation
      /function\s+(?:action|use)_[$_a-zA-Z][\w$]*\s*\(\s*node\s*(?:,\s*parameters)?\s*\)\s*\{/,

      // Event handler creation
      /function\s+bubble\s*\(\s*component\s*,\s*event\s*\)\s*\{/,
      /dispatch_dev\s*\(\s*["']binding["']\s*,\s*\{[^}]*\}\s*\)/,

      // Transition implementation
      /function\s+(?:create_(?:in|out|bidirectional)_transition|transition_(?:in|out))\s*\([^)]*\)\s*\{/,

      // Binding update logic
      /function\s+update_[$_a-zA-Z][\w$]*_binding\s*\(\s*value\s*\)\s*\{/,
    ],
  },
  {
    name: 'sveltekit' as const,
    score: 0.15,
    scripts: [
      // SvelteKit routing patterns
      /\+(?:page|layout|error|server)\.(?:js|ts|svelte)["']/,

      // Load function implementation
      /export\s+(?:async\s+)?function\s+load\s*\(\s*(?:\{\s*(?:params|session|fetch|context)\s*\}|[^)]*)\s*\)\s*\{/,

      // Navigation functions
      /goto\s*\(\s*(?:["'][^"']*["']|[$_a-zA-Z][\w$]*)\s*(?:,\s*\{[^}]*\})?\s*\)/,

      // Kit-specific imports
      /from\s+["'](?:@sveltejs\/kit|\$app\/(?:navigation|stores|environment))["']/,

      // Server-side patterns
      /handleError\s*\(\s*(?:\{\s*error\s*\}|[^)]*)\s*\)\s*\{/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Svelte components with hash-based CSS
          hasSvelteComponents:
            document.querySelectorAll('[class*="svelte-"]').length > 0,

          // Check for SvelteKit development mode
          hasSvelteKit: typeof window.__sveltekit_dev === 'object',

          // Check for Svelte runtime
          hasRuntime:
            document.querySelector('[data-svelte]') !== null ||
            document.querySelector('[data-svelte-h]') !== null,

          // Check for Svelte HMR
          hasHMR: typeof window.__SVELTE_HMR_HOT_API === 'object',

          // Check for Svelte stores
          hasStores: typeof window.__svelte === 'object',

          // Check for SvelteKit navigation
          hasNavigation:
            typeof window?.navigation?.addEventListener === 'function' &&
            document.querySelector('script[data-sveltekit]') !== null,
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
];
