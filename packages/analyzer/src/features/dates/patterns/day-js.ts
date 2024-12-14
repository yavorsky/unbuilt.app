import { Page } from 'playwright';

export const dayJs = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Day.js function and namespace
      /dayjs(?:\.|\()/,
      /(?:import|require)\s+dayjs/,
      /from\s+["']dayjs["']/,

      // Plugin system
      /dayjs\.extend\(/,
      /(?:import|require)\s+["']dayjs\/plugin\//,
      /from\s+["']dayjs\/plugin\//,

      // Common plugins
      /(?:updateLocale|localeData|customParseFormat|isSameOrBefore|isSameOrAfter)/,
      /(?:utc|timezone|duration|relativeTime|advancedFormat)/,

      // Format tokens (Moment.js compatible)
      /(?:YYYY|MM|DD|HH|mm|ss|SSS)/,
      /\[.*?\]/, // Escaped format tokens
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for global dayjs
          hasDayjs: typeof window.dayjs === 'function',

          // Check for plugins
          hasPlugins: !!window.dayjs?.extend,

          // Check for locale support
          hasLocale: !!window.dayjs?.locale,

          // Check for common plugin methods
          hasUtc: typeof window.dayjs?.utc === 'function',
          hasDuration: typeof window.dayjs?.duration === 'function',

          // Check for Moment.js compatibility
          hasFormat: typeof window.dayjs?.unix === 'function',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'plugins' as const,
    score: 0.2,
    runtime: [
      // Plugin-specific methods
      /\.(?:quarter|isoWeek|isoWeekday|isoWeekYear)/,
      /\.(?:toArray|toObject|toJSON|unix)/,
      /\.(?:diff|from|fromNow|calendar)/,

      // Common plugin combinations
      /(?:weekYear|weekOfYear|isoWeeksInYear)/,
      /(?:isDST|utcOffset|timeZone|tz)/,

      // Common locale/format patterns
      /(?:updateLocale|locale)\(['"][a-z-]+['"]/,
      /\.format\(['"](LLL?L?|l{1,4})['"]\)/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /dayjs(?:\.min)?\.js$/,
      /dayjs\.[a-f0-9]+\.js$/,
      /dayjs\/locale\//,
      /dayjs\/plugin\//,
    ],
  },
];
