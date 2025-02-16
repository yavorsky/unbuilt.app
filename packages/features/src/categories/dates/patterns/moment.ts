import { Page } from 'playwright';

export const moment = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Core moment-specific properties and methods
      // _isAMomentObject is very specific to moment.js
      /\._isAMomentObject\s*=\s*source\._isAMomentObject/,
      /\._isAMomentObject\s*=\s*true/,

      // Specific moment.js initialization pattern
      /moment\.updateOffset\s*=\s*function/,

      // This specific combination of properties is unique to moment
      /\._pf\.(?:empty|unusedTokens|unusedInput|overflow|charsLeftOver|nullInput|invalidEra|invalidMonth|invalidFormat|userInvalidated|iso|parsedDateParts|meridiem)/,
    ],
  },
  {
    name: 'stringLiterals' as const,
    score: 0.9,
    scripts: [
      // These error messages are unique to moment.js
      /use moment\.updateLocale\(localeName, config\) to change an existing locale\. moment\.defineLocale\(localeName, config\) should only be used for creating a new locale/,
      /moment\(\)\.lang\(\) is deprecated\. Instead, use moment\(\)\.localeData\(\)/,
      /moment construction falls back to js Date\(\)/,
      /"Moment Timezone setDefault\(\) requires Moment\.js >= [0-9.]+/,
      /'Moment Timezone requires Moment\.js\. See https:\/\/momentjs\.com\/timezone\/docs\/#\/use-it\/browser\/'/,

      // This specific error URL pattern is unique to moment.js
      /http:\/\/momentjs\.com\/guides\/#\/warnings\/js-date\//,
      /http:\/\/momentjs\.com\/guides\/#\/warnings\/define-locale\//,
      /http:\/\/momentjs\.com\/guides\/#\/warnings\/min-max\//,

      // This specific combination of format tokens in HTML5_FMT is unique to moment
      /DATETIME_LOCAL:"YYYY-MM-DDTHH:mm",DATETIME_LOCAL_SECONDS:"YYYY-MM-DDTHH:mm:ss",DATETIME_LOCAL_MS:"YYYY-MM-DDTHH:mm:ss\.SSS"/,
    ],
  },
  {
    name: 'internalProperties' as const,
    score: 0.8,
    scripts: [
      // These specific property combinations are unique to moment's internal structure
      /\._invalidDate\s*=\s*['"]Invalid date['"]/,
      /\._week\s*=\s*{\s*dow:\s*\d+,\s*doy:\s*\d+\s*}/,

      // Specific moment object property patterns
      /\._locale\._(?:abbr|config|ordinal|calendar|monthsParseExact)/,

      // Moment's specific timezone handling
      /\._isUTC\s*=\s*(?:true|false)/,
      /\._offset\s*=\s*(?:0|-?\d+)/,
    ],
  },
  {
    name: 'runtime-check' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for moment-specific properties
          hasMoment: typeof window.moment !== 'undefined',

          // Very specific moment.js API checks
          hasMomentSpecific:
            window.moment &&
            {}.hasOwnProperty.call(window.moment, '_isAMomentObject'),

          // Check for specific internal properties that other libraries don't use
          hasInternals:
            window.moment &&
            typeof window.moment.updateLocale === 'function' &&
            typeof window.moment.defineLocale === 'function' &&
            typeof window.moment.suppressDeprecationWarnings === 'boolean',

          // Check for moment-specific HTML5_FMT object structure
          hasFormatObject:
            window.moment &&
            window.moment.HTML5_FMT &&
            window.moment.HTML5_FMT.DATETIME_LOCAL === 'YYYY-MM-DDTHH:mm' &&
            window.moment.HTML5_FMT.DATETIME_LOCAL_SECONDS ===
              'YYYY-MM-DDTHH:mm:ss',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
