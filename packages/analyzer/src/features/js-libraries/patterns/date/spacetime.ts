import { Page } from 'playwright';

export const spacetime = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core spacetime initialization
      /spacetime\s*\(/,
      /from\s+["']spacetime["']/,
      /require\(['"]spacetime['"]\)/,

      // Unique timezone handling
      /\.goto\(['"][^'"]+['"]\)/,
      /\.timezone\(\)/,
      /\.tz\(['"][^'"]+['"]\)/,
      /spacetime\.whereIts\(/,
      /spacetime\.nowadays\(/,

      // Specific method names
      /\.epoch\(\)/,
      /\.format\(['"]nice['"]\)/,
      /\.format\(['"]iso['"]\)/,
      /\.format\(['"]day-short['"]\)/,

      // Unique features
      /\.isAwake\(\)/,
      /\.isDST\(\)/,
      /\.hasDST\(\)/,
      /\.hemisphere\(\)/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for global spacetime
          hasSpacetime: typeof window.spacetime === 'function',

          // Check for utilities
          hasUtils: !!window.spacetime?.now,

          // Check for timezone support
          hasTimezone: !!window.spacetime?.prototype?.timezone,

          // Check for unique features
          hasUnique: typeof window.spacetime?.whereIts === 'function',

          // Check for version
          hasVersion: !!window.spacetime?.version,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'plugins' as const,
    score: 0.2,
    runtime: [
      // Common plugins and extensions
      /spacetime-geo/,
      /spacetime-holiday/,
      /spacetime-daylight/,

      // Plugin methods
      /\.timeOfDay\(\)/,
      /\.nearest\(['"][^'"]+['"]\)/,
      /\.dayOfYear\(\)/,

      // Comparison methods
      /\.isSame\(['"][^'"]+['"]\)/,
      /\.isEqual\(/,
      /\.diff\(/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /spacetime(?:\.min)?\.js$/,
      /spacetime\.[a-f0-9]+\.js$/,
      /spacetime-[\w-]+\.js$/,
      /spacetime\/builds?\//,
    ],
  },
];
