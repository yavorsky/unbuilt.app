import { Page } from 'playwright';

export const luxon = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core Luxon classes and imports
      /DateTime\s*\.\s*(?:now|local|utc|fromISO|fromHTTP|fromSQL)/,
      /Duration\s*\.\s*(?:from|fromISO|fromMillis)/,
      /Interval\s*\.\s*(?:from|fromISO|fromDateTimes)/,

      // Specific Luxon methods
      /\.(?:plus|minus|startOf|endOf|toFormat|toISO|toLocal|toUTC)/,
      /\.(?:setZone|toFormat|toLocaleString|toJSDate|valueOf|diff)/,

      // Format tokens (unique to Luxon)
      /(?:DDDD|MMMM|kkkk|ZZZZ|ZZZZZ|WWWW|ooo)/,
      /ff{1,3}|SS{2,4}/,

      // Zone handling
      /Settings\.defaultZone/,
      /IANAZone|FixedOffsetZone|LocalZone/,
      /Zone\.(?:utc|local|SYSTEM)/,

      // Error handling
      /InvalidDateTime|InvalidDuration|InvalidInterval/,
      /InvalidZone|ConflictingZone/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Luxon global
          hasLuxon: typeof window.luxon !== 'undefined',

          // Check for main classes
          hasDateTime: !!window.luxon?.DateTime,
          hasDuration: !!window.luxon?.Duration,
          hasInterval: !!window.luxon?.Interval,

          // Check for settings
          hasSettings: !!window.luxon?.Settings,

          // Check for zones
          hasZones: !!window.luxon?.IANAZone,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'methods' as const,
    score: 0.2,
    scripts: [
      // Common method combinations
      /\.(?:toISO|toISODate|toISOTime|toISOWeekDate)/,
      /\.(?:toLocal|toLocaleParts|toLocaleString)/,
      /\.(?:setLocale|setZone|setLocale)/,

      // Specific API patterns
      /\.(?:isValid|invalidReason|invalidExplanation)/,
      /\.(?:toObject|toMillis|toSeconds|toJSON)/,

      // Math operations
      /\.(?:plus|minus|diff)\(\{/,
      /\.(?:startOf|endOf)\(['"][\w]+['"]\)/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /luxon(?:\.min)?\.js$/,
      /luxon\.[a-f0-9]+\.js$/,
      /\bluxon\.(?:esm|umd|cjs)\.js$/,
      /luxon-\w+\.js$/,
    ],
  },
];
