import { Page } from 'playwright';

export const svelte = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core Svelte
      /\bsvelte\b/i,
      /from\s+["']svelte["']/,
      /SvelteComponent/,
      /SvelteRegisterBlock/,
      // Svelte internal markers
      /\$\$self/,
      /\$\$props/,
      /\$\$slots/,
      // Common minified patterns
      /#svelte/,
      /\$\$render/,
      /__svelte_/,
    ],
  },
  {
    name: 'reactivity' as const,
    score: 0.3,
    scripts: [
      // Store and reactivity
      /writable|readable|derived/,
      /\$store/,
      /\$:/, // reactive declarations
      // Reactive syntax
      /\$\{[^}]+\}/,
      /\$\w+/, // auto-subscriptions
      // Store patterns
      /subscribe\s*\(/,
      /set\s*\(/,
      /update\s*\(/,
    ],
  },
  {
    name: 'lifecycle' as const,
    score: 0.25,
    scripts: [
      // Lifecycle functions
      /onMount\s*\(/,
      /onDestroy\s*\(/,
      /beforeUpdate\s*\(/,
      /afterUpdate\s*\(/,
      // Lifecycle utilities
      /setContext\s*\(/,
      /getContext\s*\(/,
      /tick\s*\(/,
      /createEventDispatcher\s*\(/,
    ],
  },
  {
    name: 'bindings' as const,
    score: 0.25,
    scripts: [
      // Action directives
      /use:[\w$]+/,
      // Event modifiers
      /on:[\w$]+\|[\w$]+/,
      // Bindings
      /bind:[\w$]+/,
      /class:[\w$]+/,
      // Transitions
      /transition:[\w$]+/,
      /in:[\w$]+/,
      /out:[\w$]+/,
      /animate:[\w$]+/,
    ],
  },
  {
    name: 'sveltekit' as const,
    score: 0.15,
    scripts: [
      // SvelteKit specific
      /from\s+["']@sveltejs\/kit["']/,
      /\+page\./,
      /\+layout\./,
      /\+server\./,
      // Load functions
      /load\s*\(/,
      /handle\s*\(/,
      // Navigation
      /goto\s*\(/,
      /invalidate\s*\(/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Svelte components
          hasSvelteComponents: !!document.querySelector('[class*="svelte-"]'),
          // Check for SvelteKit markers
          hasSvelteKit: !!window.__sveltekit_dev,
          // Check for Svelte stores
          hasSvelteStores: typeof window?.__svelte !== 'undefined',
          // Check for Svelte HMR
          hasHMR: !!window.__SVELTE_HMR_HOT_API,
          // Check for Svelte runtime
          hasRuntime: !!document.querySelector('[data-svelte]'),
          // Check for hydration markers
          hasHydration: !!document.querySelector('[data-svelte-h]'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
