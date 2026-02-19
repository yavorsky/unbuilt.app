import { Page } from 'playwright';

// Verified against minified bundle: cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js
// Survives: "bodymovin", "autoplay", "autoloadSegments", "canvas", custom element tags
export const lottie = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/lottie-web[.\-@/]/, /lottie-player[.\-@/]/, /@lottiefiles\//],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"bodymovin"/, // Lottie's original name — verified in minified bundle
    ],
  },
  {
    name: 'domMarkers' as const,
    score: 0.9,
    // Custom elements unique to Lottie
    documents: [/<lottie-player/, /<dotlottie-player/],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return document.querySelector('lottie-player') !== null ||
          document.querySelector('dotlottie-player') !== null ||
          typeof (window as Record<string, unknown>).bodymovin !== 'undefined';
      });
    },
  },
];
