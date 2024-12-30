import { Page } from 'playwright';

export const sveltekit = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      // Core SvelteKit identifiers
      /__sveltekit/,
      /\$app\/navigation/,
      /\$app\/stores/,
      /\$app\/forms/,
      /\$app\/environment/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.9,
    scripts: [
      // SvelteKit's unique data attributes
      /data-sveltekit-/,
      /data-sveltekit-prefetch/,
      /data-sveltekit-hydrate/,
      /data-sveltekit-enhanced/,
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.8,
    scripts: [
      // SvelteKit-specific state management
      /__sveltekit_hydrate/,
      /__sveltekit_data/,
      /sveltekit\.start/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for SvelteKit-specific globals
          hasSvelteKit: typeof window?.__sveltekit_dev !== 'undefined',
          hasSvelteKitData: typeof window?.__sveltekit_data !== 'undefined',
          // Check for enhanced form features (unique to SvelteKit)
          hasEnhancedForm: !!document.querySelector(
            'form[data-sveltekit-enhanced]'
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    score: 0.3,
    name: 'ssr' as const,
    scripts: [/__sveltekit_ssr/],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasSSRData: typeof window?.__sveltekit_ssr_data !== 'undefined',
          hasPreloadData: !!document.querySelector(
            'script[type="application/json"][data-sveltekit-data]'
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
