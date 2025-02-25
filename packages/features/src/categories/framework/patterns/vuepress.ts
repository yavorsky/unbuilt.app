import { Page } from 'playwright';

export const vuepress = [
  {
    name: 'core' as const,
    score: 1,
    scripts: [
      // Error message
      /\[\s*vuepress\s*\]\s*Cannot\s+resolve\s+layout/,
      // VuePress-specific globals and identifiers
      /\$vuepress/,
      /__VUEPRESS_VERSION__/,
      /__VUEPRESS_DEV__/,
      // Props and component structure patterns
      /(?:VPSidebarItem|VPNavLink)\s*,\s*\{\s*(?:key|item|text|link)\s*:/,
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.8,
    scripts: [
      // VuePress hydration and client-specific markers
      /__VUEPRESS_PREFETCH__/,
      /__VUEPRESS_PRELOAD__/,
    ],
  },
  {
    name: 'tab-markers' as const,
    score: 0.9,
    scripts: [/"VUEPRESS_TAB_STORE"/, /"VUEPRESS_CODE_TAB_STORE"/],
  },
  {
    name: 'env' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasVuePress: typeof window?.__VUEPRESS__ !== 'undefined',
          hasVuePressVersion:
            typeof window?.__VUEPRESS_VERSION__ !== 'undefined',
          hasVuePressRouter: typeof window?.__VUEPRESS_ROUTER__ !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    score: 1,
    name: 'browser-checks' as const,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          container:
            document.querySelector(
              'div.vp-theme-container, div[vp-container]'
            ) !== null,
          hasNavbar: document.querySelector('.vp-theme-container') !== null,
          hasSidebar: document.querySelector('.vp-sidebar-mask') !== null,
          hasHome: document.querySelector('.vp-home') !== null,
          hasContent:
            document.querySelector('div[vp-content], div.vp-content') !== null,
        };

        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
  {
    score: 0.5,
    name: 'ssr-local' as const,
    scripts: [
      // VuePress SSR-specific patterns
      /__VUEPRESS_SSR__/,
    ],
  },
  {
    score: 0.8,
    name: 'ssr' as const,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // VuePress SSR markers
          hasInitialState: typeof window?.__INITIAL_STATE__ !== 'undefined',

          // Check for VuePress router in SSR mode
          hasSSRRouter:
            typeof window?.__VUEPRESS_ROUTER__?.options?.ssr !== 'undefined',
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
];
