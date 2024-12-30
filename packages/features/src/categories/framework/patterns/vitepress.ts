import { Page } from 'playwright';

export const vitepress = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      // VitePress-specific globals and identifiers
      /__VITEPRESS_/,
      /window\.__VP_/,
      /__VP_HASH_MAP/,
      /__VP_SITE_DATA/,
      /window\.__VITEPRESS_DEV__/,
      /window\.__VITEPRESS_SSR__/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.9,
    scripts: [
      // VitePress-specific DOM elements and classes
      /div\[class\*="VPDoc"\]/,
      /div\[class\*="VPNav"\]/,
      /div\[class\*="VPSidebar"\]/,
      /div\[class\*="VPContent"\]/,
      /div\[class\*="VPFooter"\]/,
      /class="vp-doc"/,
      /class="VPHomeHero"/,
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.8,
    scripts: [
      // VitePress hydration and state management
      /__VITEPRESS_DATA__/,
      /window\.__VITEPRESS_INITIAL_STATE__/,
      /__VP_STATIC_DATA__/,
      /__vitepress_runtime_data__/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasVitePress: typeof window?.__VITEPRESS__ !== 'undefined',
          hasVPData: typeof window?.__VP_SITE_DATA !== 'undefined',
          hasVPDoc: !!document.querySelector('.vp-doc'),
          hasVPNav: !!document.querySelector('.VPNav'),
          hasVPTheme: !!document.querySelector('[class*="VPTheme"]'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    score: 0.3,
    name: 'ssr' as const,
    scripts: [
      // VitePress SSR-specific patterns
      /__VITEPRESS_SSR__/,
      /window\.__VITEPRESS_DATA__/,
      /data-server-rendered="true"/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // VitePress SSR data
          hasSSRData: typeof window?.__VITEPRESS_DATA__ !== 'undefined',

          // Server rendered attribute
          hasSSRAttribute: !!document.querySelector('[data-server-rendered]'),

          // VitePress content with SSR
          hasSSRContent: !!document.querySelector('.VPContent')?.innerHTML,

          // Check for VitePress theme in SSR mode
          hasSSRTheme: !!document.querySelector(
            '[class*="VPTheme"][data-server-rendered]'
          ),

          // Check for static data
          hasStaticData: typeof window?.__VP_STATIC_DATA__ !== 'undefined',
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
];
