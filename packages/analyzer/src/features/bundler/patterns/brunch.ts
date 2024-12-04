import { Page } from 'playwright';

export const brunch = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // Brunch-specific globals and identifiers
      /window\.__brunch__/,
      /__brunch__/,
      /window\.require\.brunch/,
      /require\.brunch\s*=/,
    ],
  },
  {
    name: 'module-system' as const,
    score: 0.8,
    runtime: [
      // Brunch-specific module system
      /require\.register\s*\(/,
      /require\.modules\s*=/,
      /require\.registerFiles\s*\(/,
    ],
  },
  {
    name: 'config' as const,
    score: 0.6,
    filenames: [
      // Brunch-specific config files
      /brunch-config\.[jt]s$/i,
      /\.brunch\//i,
    ],
  },
  {
    // Runtime detection through browser globals
    name: 'runtime-check' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasBrunch: typeof window.__brunch__ !== 'undefined',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          hasRequire: typeof (window.require as any)?.brunch !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
