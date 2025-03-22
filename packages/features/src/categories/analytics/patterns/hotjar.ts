import { Page } from 'playwright';

export const hotjar = [
  {
    name: 'globals' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasHotjar: !!window.hj,
          hasHotjarBootstrap: !!window.hjBootstrap,
          hasSettings: !!window._hjSettings,
          hasHotjarBootstrapCalled: Array.isArray(window.hjBootstrapCalled),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'script' as const,
    score: 0.9,
    scripts: [
      /["']For security reasons, Hotjar only works over HTTPS\. Learn more: https:\/\/help\.hotjar\.com\/hc\/en-us\/articles\/115011624047["']/,
      /["']Hotjar not launching due to suspicious userAgent:["']/,
      /["']start:hotjar["']/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/static\.hotjar\.com/],
  },
];
