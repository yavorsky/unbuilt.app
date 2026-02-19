import { Page } from 'playwright';

// Framer Motion — strong DOM markers (data-framer-*, data-projection-id)
// and unique string identifiers
export const framerMotion = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/framer-motion[.\-@/]/, /motion\/react/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.9,
    // data-framer-* and data-projection-id are unique to Framer Motion
    documents: [/data-framer-/, /data-projection-id/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.8,
    scripts: [
      /"framer-motion"/, // Package self-reference
      /"AnimatePresence"/, // Component name preserved as string
      /"motion"/, // This alone is weak, but combined with other signals it helps
      /"LazyMotion"/, // Component name
      /"MotionConfig"/, // Component name
    ],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Framer Motion adds data-projection-id to animated elements
        return document.querySelector('[data-projection-id]') !== null ||
          document.querySelector('[data-framer-appear-id]') !== null;
      });
    },
  },
];
