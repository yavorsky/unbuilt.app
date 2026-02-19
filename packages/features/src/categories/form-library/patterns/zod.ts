import { Page } from 'playwright';

// Zod detection must avoid false positives from minified code where
// single-letter variables like `z` are common. Only match:
// - String literals that survive minification (error messages, class names)
// - Package name references in bundles
// - Runtime identifiers that are never minified (exported class/type names)
export const zod = [
  {
    name: 'coreBundle' as const,
    score: 1,
    // Package name in bundle comments, source maps, or chunk names
    filenames: [/zod[.\-@/]/, /node_modules\/zod/],
  },
  {
    name: 'errorStrings' as const,
    score: 0.9,
    scripts: [
      // Zod's unique error messages and identifiers (string literals survive minification)
      /"ZodError"/, // Error class name as string
      /"ZodType"/, // Base type string
      /"ZodObject"/, // Schema type strings
      /"ZodString"/,
      /"ZodNumber"/,
      /"ZodArray"/,
      /"ZodEnum"/,
      /"ZodUnion"/,
      /"ZodIntersection"/,
      /ZodIssueCode/, // Error code enum references
      /"invalid_type"/, // Zod-specific error codes
      /"too_small"/,
      /"too_big"/,
      /"invalid_string"/,
    ],
  },
  {
    name: 'resolverIntegration' as const,
    score: 0.8,
    scripts: [
      // zodResolver is a named export from @hookform/resolvers — survives minification as string key
      /"zodResolver"/,
      /zodResolver/,  // Also referenced as import name in non-minified chunks
    ],
    filenames: [/hookform.*resolvers.*zod/, /resolvers\/zod/],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Check for Zod error instances or schemas in global scope / window
        const scripts = Array.from(document.querySelectorAll('script'));
        return scripts.some((s) => {
          const text = s.textContent || '';
          return text.includes('"ZodError"') || text.includes('"ZodType"');
        });
      });
    },
  },
];
