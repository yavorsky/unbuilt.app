import { Page } from 'playwright';

export const ky = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    runtime: [
      // Core Ky-specific imports
      /import\s+(?:\* as\s+)?ky\s+from\s+['"](?:ky|ky-universal)['"]/,
      /require\s*\(\s*['"](?:ky|ky-universal)['"]\s*\)/,

      // Ky-specific instance creation
      /ky\.(?:create|extend)\s*\(\s*\{[^}]*(?:prefixUrl|throwHttpErrors|retry):/,

      // Ky's unique method chaining patterns
      /ky(?:\.default)?\s*\([^)]*\)\.(?:json|text|blob|arrayBuffer|formData)\s*\(\s*\)/,
      /ky(?:\.default)?\.(?:get|post|put|patch|delete|head)\s*\([^)]*\)\.(?:json|text|blob|arrayBuffer|formData)\s*\(\s*\)/,

      // Ky-specific options that don't exist in other libraries
      /throwHttpErrors:\s*(?:true|false)/,
      /prefixUrl:\s*(?:['"`]|new URL)/,
      /hooks:\s*\{\s*(?:beforeRequest|afterResponse|beforeRetry|beforeError):/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- No need to type-check ky object
        const isKyInstance = (obj: any) => {
          return (
            obj &&
            typeof obj === 'function' &&
            'extend' in obj &&
            'create' in obj &&
            obj.toString().includes('ky')
          );
        };

        return !!(
          // Check for Ky-specific features
          (
            (window.ky && isKyInstance(window.ky)) ||
            Object.values(window).some(
              (obj) => isKyInstance(obj) && 'HTTPError' in obj
            )
          )
        );
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.3,
    runtime: [
      // Ky-specific hook patterns
      /beforeRequest:\s*\[\s*async\s*\([^)]*\)\s*=>\s*\{[^}]*\}\s*\]/,
      /afterResponse:\s*\[\s*async\s*\([^)]*\)\s*=>\s*\{[^}]*\}\s*\]/,

      // Ky-specific error handling
      /if\s*\(\s*error\s+instanceof\s+ky\.HTTPError\s*\)/,
      /throw\s+new\s+ky\.HTTPError\s*\(/,

      // Ky-specific retry configuration
      /retry:\s*\{\s*(?:limit|methods|statusCodes|afterStatusCodes):/,

      // Ky-specific progress monitoring
      /onDownloadProgress:\s*\(\s*\{\s*percent\s*\}\s*\)\s*=>/,
      /onUploadProgress:\s*\(\s*\{\s*percent\s*\}\s*\)\s*=>/,

      // Ky-specific search params handling
      /searchParams:\s*(?:new\s+URLSearchParams|new\s+URL|['"`]|{)/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Ky-specific library files
      /(?:^|\/)ky(?:\.min)?\.js$/i,
      /(?:^|\/)ky-universal(?:\.min)?\.js$/i,

      // Ky-specific configuration files
      /ky-instance\.js$/i,
      /ky-config\.js$/i,

      // Build output specific to Ky
      /\bky\.[a-f0-9]{8}\.js$/i, // Build hash pattern
    ],
  },
];
