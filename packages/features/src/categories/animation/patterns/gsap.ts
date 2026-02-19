import { Page } from 'playwright';

// Verified against minified bundle: cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js
// Survives: GreenSock, GreenSockGlobals, gsap, registerPlugin, scrollTrigger
export const gsap = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/gsap[.\-@/]/, /greensock/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      // Verified in minified bundle
      /GreenSock/, // Brand name — not a string literal, but a code identifier that survives
      /GreenSockGlobals/, // Global registration
      /registerPlugin/, // Plugin API — property name on gsap object
      /"scrollTrigger"/, // String literal in minified bundle
      /"autoAlpha"/, // GSAP-unique CSS property string
    ],
  },
  {
    name: 'browser-check' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return typeof (window as Record<string, unknown>).gsap !== 'undefined' ||
          typeof (window as Record<string, unknown>).GreenSockGlobals !== 'undefined';
      });
    },
  },
];
