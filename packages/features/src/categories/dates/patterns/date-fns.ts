import { Page } from 'playwright';

export const dateFns = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core imports/functions
      /from\s+["']date-fns["']/,
      /(?:import|require)\s*\{?\s*(?:format|parse|add|sub|diff|is)[A-Z]\w+\s*\}?\s*from\s*["']date-fns["']/,

      // Common date-fns functions
      /(?:parse|format|add|sub|differenceIn|startOf|endOf|is(?:Before|After|Same|Valid|Weekend|Future|Past))/,
      /(?:get|set|add|sub)(?:Hours|Minutes|Seconds|Milliseconds|Days|Months|Years|Weeks)/,

      // Format strings (unique to date-fns)
      /(?:yyyy|YYYY|MM|dd|DD|HH|mm|ss|T)/,
      /P(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?/,

      // Locale handling
      /from\s+["']date-fns\/locale["']/,
      /\/date-fns\/locale\//,

      // FP variant
      /from\s+["']date-fns\/fp["']/,
      /\/date-fns\/fp\//,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for common functions in global scope
          hasFunctions:
            typeof window.format === 'function' ||
            typeof window.parse === 'function',

          // Check for date-fns namespace
          hasNamespace: !!window.dateFns,

          // Check for fp variant
          hasFp: !!window.dateFnsFp,

          // Check for locale functions
          hasLocale:
            typeof window.formatRelative === 'function' ||
            typeof window.formatDistance === 'function',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'modules' as const,
    score: 0.2,
    scripts: [
      // ESM imports
      /\/_lib\/\w+\/index\.js/,
      /\/_lib\/locale\/\w+\/index\.js/,

      // Common function combinations
      /(?:formatDistance|formatRelative|formatDuration)/,
      /(?:eachDayOfInterval|eachWeekOfInterval|eachMonthOfInterval|eachYearOfInterval)/,
      /(?:lastDayOf|firstDayOf)(?:Week|Month|Year|Quarter)/,

      // Error messages specific to date-fns
      /is not a valid date/,
      /requires \d+ arguments? but received \d+/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /date-fns(?:\.min)?\.js$/,
      /date-fns\/\w+\.js$/,
      /date-fns-\w+\.js$/,
      /\bdate-fns\.[a-f0-9]+\.js$/,
    ],
  },
];
