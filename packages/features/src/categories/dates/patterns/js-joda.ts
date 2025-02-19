export const jsJoda = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // js-joda specific JSR-310 error messages that no other library would have
      /"DateTimeException: TemporalField must not be null"/,
      /"DateTimeException: ChronoField must not be null"/,
      /"DateTimeException: ChronoUnit must not be null"/,

      // js-joda specific validation messages with exact format
      /"DateTimeException: Invalid value for YearOfEra"/,
      /"DateTimeException: Invalid value for MonthOfYear"/,
      /"UnsupportedTemporalTypeException: Unsupported field: FieldUnsupported"/,

      // License
      /@copyright.*js-joda.*contributors/,
      /DateTimeFormatter.*ISO_LOCAL_DATE.*ISO_LOCAL_TIME/,
      /MIN_SAFE_INTEGER.*MAX_SAFE_INTEGER.*safeToInt/,
      /Pattern using \(localized\) text not implemented, use @js-joda\/locale plugin!/,
      /time must be an instance of LocalTime or OffsetTime/,
      /Pattern using (localized) text not implemented yet/,
      /t === v\.MONTHS \|\| t === v\.YEARS \|\| t === v\.DECADES \|\| t === v\.CENTURIES \|\| t === v\.MILLENNIA \|\| t === v\.ERAS /,
    ],
  },
  {
    name: 'uniqueEnums' as const,
    score: 0.9,
    scripts: [
      // js-joda specific enum values that won't exist in other libraries
      /ChronoField\.ALIGNED_WEEK_OF_MONTH|ChronoField\.ALIGNED_DAY_OF_WEEK_IN_MONTH/,
      /ChronoUnit\.HALF_DAYS|ChronoUnit\.FOREVER/,
      /IsoChronology\.INSTANCE/,
    ],
  },
  {
    name: 'uniqueUsage' as const,
    score: 0.8,
    scripts: [
      // js-joda specific Period formatting that's unique to this library
      /Period\.parse\("P\d+Y\d+M\d+D"\)/,

      // js-joda specific zone handling
      /ZoneRegion\.of\("[^"]+"\)/,

      // js-joda specific clock usage
      /Clock\.system\(ZoneId\.of\([^)]+\)\)/,
    ],
  },
  {
    name: 'vars' as const,
    score: 0.3,
    scripts: [/ALIGNED_DAY_OF_WEEK_IN_MONTH/, /ALIGNED_DAY_OF_WEEK_IN_YEAR/],
  },
];
