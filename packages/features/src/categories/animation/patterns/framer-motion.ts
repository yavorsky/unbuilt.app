import { Page } from 'playwright';

// Verified against minified bundle: cdn.jsdelivr.net/npm/framer-motion@11.11.0/dist/cjs/index.min.js
// Survives: "data-framer-portal-id", "framer-motion", "framerAppearId", "motionComponentSymbol", "projectionUpdate"
export const framerMotion = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/framer-motion[.\-@/]/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      // Verified in minified CJS bundle
      /"framer-motion"/, // Package self-reference
      /"data-framer-portal-id"/, // DOM attribute string
      /"framerAppearId"/, // Internal identifier
      /"motionComponentSymbol"/, // Symbol name
      /"projectionUpdate"/, // Event name
      /"projectionFrame"/, // Event name
    ],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // data-projection-id is added to animated elements at runtime
        return document.querySelector('[data-projection-id]') !== null ||
          document.querySelector('[data-framer-portal-id]') !== null;
      });
    },
  },
];
