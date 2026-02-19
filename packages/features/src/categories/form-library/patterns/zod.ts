import { Page } from 'playwright';

// Verified against minified bundle: cdn.jsdelivr.net/npm/zod@3.23.8/lib/index.min.mjs
// All "Zod*" class names and error codes survive Terser minification as string literals.
export const zod = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/zod[.\-@/]/, /node_modules\/zod/],
  },
  {
    name: 'typeStrings' as const,
    score: 0.9,
    scripts: [
      // Zod type registry strings — verified present in minified bundle
      /"ZodObject"/,
      /"ZodString"/,
      /"ZodNumber"/,
      /"ZodArray"/,
      /"ZodEnum"/,
      /"ZodError"/,
      /"ZodUnion"/,
      /"ZodBoolean"/,
    ],
  },
  {
    name: 'errorCodes' as const,
    score: 0.8,
    scripts: [
      // Zod issue codes — unique string literals verified in minified bundle
      /"invalid_type"/,
      /"invalid_enum_value"/,
      /"invalid_union"/,
      /"invalid_string"/,
      /"too_small"/,
      /"too_big"/,
      /"unrecognized_keys"/,
      /"not_multiple_of"/,
      /"not_finite"/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script'));
        return scripts.some((s) => {
          const text = s.textContent || '';
          // Check for multiple Zod type strings — one alone could be coincidence
          return (text.includes('"ZodObject"') && text.includes('"ZodString"')) ||
            (text.includes('"ZodError"') && text.includes('"invalid_type"'));
        });
      });
    },
  },
];
