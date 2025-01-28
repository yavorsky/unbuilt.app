import { Page } from 'playwright';

export const nuxt = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      /$nuxt/, // Nuxt 2 global instance
      /\$nuxt\./,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.9,
    scripts: [
      // Nuxt-specific DOM attributes and markers
      /_nuxt\//, // Nuxt asset prefix
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.8,
    scripts: [
      // Nuxt-specific hydration markers
      /__NUXT_STATE__/,
      /__NUXT_LOADED__/,
      /__NUXT_ERROR__/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Core Nuxt globals
          hasNuxtData: typeof window.__NUXT__ !== 'undefined',
          hasNuxtInstance: typeof window.$nuxt !== 'undefined',

          // DOM markers
          hasNuxtContainer: !!document.getElementById('__nuxt'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.8,
    filenames: [
      // Generated directories
      /\.nuxt\//,
      /_nuxt\//,
      /\/_nuxt\//,
    ],
  },
];
