export const dateFns = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // date-fns specific error messages from core implementation
      /"weekStartsOn must be between 0 and 6 inclusively"/,
      /firstWeekContainsDate must be between 1 and 7 inclusively/,
      /"startDate or endDate for interval cannot be Invalid Date"/,
      /"The step must be a number between 0 and 7 inclusively"/,
      /"useAdditionalDayPeriodTokens must be used with isProtectedDayPeriodToken"/,
    ],
  },
  {
    name: 'additionalTokens' as const,
    score: 0.5,
    scripts: [
      /firstWeekContainsDate/,
      /["']abbreviated["'].*["']narrow["'].*["']short["'].*["']wide["']/,
    ],
  },
  {
    name: 'uniqueFunctions' as const,
    score: 0.8,
    scripts: [
      // Combinations of unique date-fns function names that survive minification
      /eachWeekendOfInterval\([^)]+\)|eachWeekendOfMonth\([^)]+\)|eachWeekendOfYear\([^)]+\)/,
      /differenceInBusinessDays\([^)]+\)|addBusinessDays\([^)]+\)|subBusinessDays\([^)]+\)/,
      /differenceInCalendarISOWeeks\([^)]+\)|startOfISOWeek\([^)]+\)|lastDayOfISOWeek\([^)]+\)/,

      // Unique quarters handling functions
      /getQuarter\([^)]+\)|setQuarter\([^)]+\)|startOfQuarter\([^)]+\)|lastDayOfQuarter\([^)]+\)/,

      // Specific ISO week-numbering year functions
      /getISOWeekYear\([^)]+\)|startOfISOWeekYear\([^)]+\)|endOfISOWeekYear\([^)]+\)/,
    ],
  },
  {
    name: 'formatUsage' as const,
    score: 0.7,
    scripts: [
      // Unique date-fns format string combinations
      /format\([^,]+,\s*["']PPPPp["']\)/,
      /format\([^,]+,\s*["']RRRR["']\)/,
      /formatISO9075\([^)]+\)/,

      // Specific format with locale
      /format\([^,]+,\s*["'][^"']+["'],\s*\{locale:\s*[^}]+\}\)/,
    ],
  },
  {
    name: 'localeSetup' as const,
    score: 0.7,
    scripts: [
      // date-fns specific locale setup patterns
      /"Wrong first weekday of week"/,
      /"ordinalNumber function is required"/,
      /"localizer function is required"/,
    ],
  },
  {
    name: 'intervalUsage' as const,
    score: 0.8,
    scripts: [
      // Unique interval functions
      /eachDayOfInterval\([^)]+\)|eachHourOfInterval\([^)]+\)|eachMinuteOfInterval\([^)]+\)/,

      // Interval checking with specific options
      /isWithinInterval\([^,]+,\s*\{start:[^,]+,\s*end:[^}]+\}\)/,

      // Are intervals overlapping
      /areIntervalsOverlapping\([^,]+,\s*[^,]+(?:,\s*\{inclusive:\s*(?:true|false)\}\s*)?\)/,
    ],
  },
  {
    name: 'fpUsage' as const,
    score: 0.6,
    scripts: [
      // date-fns/fp specific usage
      /import\s*\{[^}]*\}\s*from\s*["']date-fns\/fp["']/,

      // Functional programming style with date-fns
      /pipe\(\s*(?:addDays|addMonths|addYears)\s*\(\d+\)\s*,\s*(?:format|formatDistance|formatRelative)/,
    ],
  },
  {
    // date-fns 4.0+ patterns - Added 2025-12-15
    name: 'dateFns4Features' as const,
    score: 0.3,
    scripts: [
      // date-fns 4 timezone support
      /TZDate/,
      /zonedTimeToUtc/,
      /utcToZonedTime/,

      // date-fns 4 interval type
      /Interval\s*[:{]/,
      /isWithinInterval/,
      /areIntervalsOverlapping/,

      // date-fns 4 Duration improvements
      /Duration\s*[:{]/,
      /formatDuration/,
      /intervalToDuration/,
    ],
  },

];
