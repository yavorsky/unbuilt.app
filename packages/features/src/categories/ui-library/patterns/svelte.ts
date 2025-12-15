import { Page } from 'playwright';

export const svelte = [
  {
    name: 'coreRuntime' as const,
    score: 0.5,
    scripts: [
      // $$, ctx, and dirty are preserved even in minified Svelte output
      /\$\$\.(?:ctx|dirty)\[\d+\]/,

      // Svelte's internal fragment mounting - unique to Svelte
      /\$\$\.fragment\s*=/,

      // Internal component initialization with $$ object
      /\$\$\s*=\s*{\s*(?:(?:ctx|dirty|on_mount|on_destroy|before_update|after_update|fragment)\s*:|(?:\s*,\s*)?)+/,
    ],
  },
  {
    name: 'reactivity' as const,
    score: 0.3,
    scripts: [
      // Internal store subscription pattern - unique to Svelte
      /\$\$\.subscription\s*=\s*subscribe/,

      // Store validation using safe_not_equal - very specific to Svelte
      /safe_not_equal\s*\([^,]+,\s*[^)]+\)/,
    ],
  },
  {
    name: 'sveltekit' as const,
    score: 0.8,
    scripts: [
      // SvelteKit's navigation store pattern
      /__sveltekit(?:_\w+)?\.navigation/,

      // SvelteKit's page store
      /__sveltekit(?:_\w+)?\.page/,
    ],
  },
  {
    name: 'dom' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for SvelteKit dev tools
          hasSvelteComponents:
            document.querySelectorAll('[class*="svelte-"]').length > 0,

          hasRuntime:
            document.querySelector('[data-svelte]') !== null ||
            document.querySelector('[data-svelte-h]') !== null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'sveltekit' as const,
    score: 0.8,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const svelteKitProperty = Object.keys(window).find((key) =>
          key.startsWith('__sveltekit')
        );

        const markers = {
          hasSvelteKitObject: svelteKitProperty
            ? window[svelteKitProperty]
            : null,
          // Check for SvelteKit
          hasSvelteKitSelectors:
            document.querySelector('script[data-sveltekit]') !== null,
        };
        return !!Object.values(markers).filter(Boolean).length;
      });
    },
  },
  {
    name: 'runtimeExecution' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for SvelteKit development mode
          hasSvelteKit: typeof window.__sveltekit_dev === 'object',

          // Check for Svelte stores
          hasSvelteGlobal: typeof window.__svelte === 'object',
        };

        // Require at least two markers for more reliable detection
        return !!Object.values(markers).filter(Boolean).length;
      });
    },
  },
  {
    // Svelte 5 Runes - Added 2025-12-15
    name: 'svelte5Runes' as const,
    score: 0.5,
    scripts: [
      // Svelte 5 runes - new reactivity primitives
      /\$state\s*[=(]/,
      /\$derived\s*\(/,
      /\$effect\s*\(/,
      /\$props\s*\(/,
      /\$bindable\s*\(/,

      // Svelte 5 internal markers
      /__svelte_runes/,
      /svelte\/reactivity/,
      /$.proxy/,
    ],
  },

];
