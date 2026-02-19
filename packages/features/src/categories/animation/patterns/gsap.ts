import { Page } from 'playwright';

// GSAP — has strong unique identifiers. "gsap" as a 4-letter word is distinctive,
// but gsap.to() / gsap.from() are too generic in minified code.
// Focus on string identifiers and runtime globals.
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
      /"GreenSock"/, // Brand name in license comments / strings
      /"gsap"/, // Self-reference
      /"ScrollTrigger"/, // Plugin name as string
      /"ScrollSmoother"/, // Plugin name
      /"Draggable"/, // Plugin name
      /"MotionPathPlugin"/, // Plugin name
      /gsap\.registerPlugin/, // This specific API is never minified (property access on known global)
    ],
  },
  {
    name: 'browser-check' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // GSAP registers itself as window.gsap
        return typeof (window as Record<string, unknown>).gsap !== 'undefined' ||
          typeof (window as Record<string, unknown>).GreenSockGlobals !== 'undefined';
      });
    },
  },
];
