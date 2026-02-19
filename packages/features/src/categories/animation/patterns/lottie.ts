import { Page } from 'playwright';

// Lottie — has strong DOM markers (custom elements) and unique runtime identifiers
export const lottie = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/lottie-web[.\-@/]/, /lottie-player[.\-@/]/, /@lottiefiles\//],
  },
  {
    name: 'domMarkers' as const,
    score: 0.9,
    // Custom elements that are unique to Lottie
    documents: [/<lottie-player/, /<dotlottie-player/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.8,
    scripts: [
      /"lottie-web"/, // Package self-reference
      /"bodymovin"/, // Lottie's original name (string reference)
      /lottie\.loadAnimation/, // Known API on the lottie global
    ],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return document.querySelector('lottie-player') !== null ||
          document.querySelector('dotlottie-player') !== null ||
          typeof (window as Record<string, unknown>).lottie !== 'undefined' ||
          typeof (window as Record<string, unknown>).bodymovin !== 'undefined';
      });
    },
  },
];
