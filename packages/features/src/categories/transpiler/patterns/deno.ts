import { Page } from 'playwright';

export const deno = [
  {
    name: 'denoSpecific' as const,
    score: 0.4, // Higher score for Deno-specific features
    scripts: [
      // Deno's unique namespace usages
      /Deno\.(?:core|internal|ops)\./,
      /\["Deno"\]/,

      // Deno's permissions and runtime checks
      /DenoPermissions\./,
      /globalThis\.Deno\./,

      // Deno's import maps handling
      /import\.meta\.(?:resolve|url)\s*=\s*"(?:deno:|node:)/,

      // Deno's custom error handling
      /\bDenoError\b/,
    ],
  },
  {
    name: 'moduleSystem' as const,
    score: 0.3,
    scripts: [
      // Deno's unique module handling
      /import\s*\.\s*meta\s*\.\s*main\s*===\s*import\s*\.\s*meta\s*\.\s*url/,

      // Deno's module resolution
      /new\s+URL\(["'][^"']+["'],\s*import\.meta\.url\)/,

      // Deno's dynamic import handling
      /\/\*\s*@deno-types\s*\*\//,
      /\/\*\s*@deno-emit\s*\*\//,
    ],
  },
  {
    name: 'transformFeatures' as const,
    score: 0.3,
    scripts: [
      // Deno's unique TypeScript transformations
      /\bDenoTypes\./,
      /\bDenoNamespace\./,

      // Deno's decorator handling
      /\bDenoDecorator\(/,
      /\bDenoMetadata\(/,

      // Deno's async transforms
      /await\s+DenoAsync\./,
      /\bDenoPromise\./,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Only check for unique Deno globals
        return typeof window.Deno !== 'undefined';
      });
    },
  },
];
