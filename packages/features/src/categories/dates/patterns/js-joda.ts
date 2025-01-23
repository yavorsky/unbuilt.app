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
];
