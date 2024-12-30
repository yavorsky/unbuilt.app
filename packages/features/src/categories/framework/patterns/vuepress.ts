import { Page } from 'playwright';

export const vuepress = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      // VuePress-specific globals and identifiers
      /\$vuepress/,
      /\$withBase/,
      /__VUEPRESS_VERSION__/,
      /__VUEPRESS_DEV__/,
      /__VUEPRESS_SSR__/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.9,
    scripts: [
      // VuePress-specific DOM elements and classes
      /div\[class\*="theme-container"\]/,
      /div\[class\*="theme-default"\]/,
      /div\[class\*="navbar"\].*?div\[class\*="site-name"\]/,
      /div\[class\*="sidebar"\].*?div\[class\*="sidebar-items"\]/,
      /class="external-link-icon"/,
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.8,
    scripts: [
      // VuePress hydration and client-specific markers
      /__VUEPRESS_PREFETCH__/,
      /__VUEPRESS_PRELOAD__/,
      /window\.__VUEPRESS__/,
      /window\.__VUEPRESS_ROUTER__/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasVuePress: typeof window?.__VUEPRESS__ !== 'undefined',
          hasVuePressRouter: typeof window?.__VUEPRESS_ROUTER__ !== 'undefined',
          hasThemeContainer: !!document.querySelector('.theme-container'),
          hasSiteNav: !!document.querySelector('.site-name'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    score: 0.3,
    name: 'ssr' as const,
    scripts: [
      // VuePress SSR-specific patterns
      /useSSRContext/,
      /__VUEPRESS_SSR__/,
      /window\.__INITIAL_STATE__/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // VuePress SSR markers
          hasInitialState: typeof window?.__INITIAL_STATE__ !== 'undefined',

          // Theme container with SSR content
          hasSSRContent:
            !!document.querySelector('.theme-container')?.innerHTML,

          // VuePress specific SSR attributes
          hasSSRAttributes: !!document.querySelector('[data-server-rendered]'),

          // Check for VuePress router in SSR mode
          hasSSRRouter:
            typeof window?.__VUEPRESS_ROUTER__?.options?.ssr !== 'undefined',

          // Check for hydration markers
          hasHydrationMarkers: !!document.querySelector('[data-v-app]'),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
];
