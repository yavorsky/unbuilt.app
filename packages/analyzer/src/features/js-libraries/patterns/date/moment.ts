import { Page } from 'playwright';

export const moment = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Global Moment object
      /moment(?:\.|\[)/,
      /moment\.version/,
      /moment\.fn\./,

      // Core functionality
      /moment\.(?:utc|parseZone|unix)/,
      /moment\.duration/,
      /moment\.locale/,

      // Format tokens
      /[YQMDWHhmsSw]{1,4}/, // Format patterns
      /\[\w+\s*(?:Mo|Do|DDDo|[\w\s]*?o)\]/, // Ordinal formats

      // Localization
      /moment\.defineLocale/,
      /moment\.updateLocale/,
      /moment\.locale\(/,

      // Plugins and extensions
      /moment\.(?:tz|timezone)/,
      /moment\.calendar/,
      /moment\.relativeTime/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for global moment
          hasMoment: typeof window.moment !== 'undefined',

          // Check for version
          hasVersion: !!window.moment?.version,

          // Check for locales
          hasLocales: typeof window.moment?.locale === 'function',

          // Check for timezone support
          hasTimezone: !!window.moment?.tz,

          // Check for relative time
          hasRelativeTime:
            typeof window.moment?.duration?.fn?.humanize === 'function',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'localization' as const,
    score: 0.2,
    runtime: [
      // Common locale patterns
      /weekdays|months/,
      /dayOfMonthOrdinalParse/,
      /relativeTime/,
      /calendar\s*:\s*\{/,

      // Format strings
      /YYYY[-\/]MM[-\/]DD/,
      /DD[-\/]MM[-\/]YYYY/,

      // Ordinal formatting
      /(?:Mo|Do|DDDo|[\w\s]*?o)\b/,
      /ordinal\s*:/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /moment(?:\.min)?\.js$/,
      /moment-with-locales(?:\.min)?\.js$/,
      /moment-timezone(?:\.min)?\.js$/,
      /locale\/[a-z-]+\.js$/,
    ],
  },
];
