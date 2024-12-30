import { Page } from 'playwright';

export const jsJoda = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core classes (Java-style naming)
      /LocalDate(?:Time)?/,
      /ZonedDateTime/,
      /Instant|Duration|Period/,
      /(?:Year|Month|DayOf(?:Week|Month)|Clock)/,

      // js-joda specific imports
      /from\s+["']@js-joda\/core["']/,
      /from\s+["']@js-joda\/timezone["']/,
      /from\s+["']@js-joda\/locale_en["']/,

      // Method patterns (Java-style)
      /\.(?:of|from|parse|get|with|plus|minus)/,
      /\.(?:atZone|withZone|toLocalDate|toLocalTime)/,

      // Temporal patterns
      /ChronoUnit\./,
      /ChronoField\./,
      /TemporalAdjusters\./,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for JSJoda global
          hasJSJoda: typeof window.JSJoda !== 'undefined',

          // Check for main classes
          hasLocalDateTime: !!window.JSJoda?.LocalDateTime,
          hasZonedDateTime: !!window.JSJoda?.ZonedDateTime,

          // Check for temporal utilities
          hasChronoUnit: !!window.JSJoda?.ChronoUnit,
          hasChronoField: !!window.JSJoda?.ChronoField,

          // Check for formatters
          hasDateTimeFormatter: !!window.JSJoda?.DateTimeFormatter,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'formatting' as const,
    score: 0.2,
    scripts: [
      // Formatting patterns
      /DateTimeFormatter\./,
      /DateTimeFormatterBuilder\./,
      /ResolverStyle\./,

      // Common formatter usage
      /ISO_LOCAL_DATE(?:_TIME)?/,
      /ISO_OFFSET_DATE_TIME/,
      /ISO_ZONED_DATE_TIME/,

      // Format patterns (unique to js-joda)
      /ofPattern\(['"][yMdHms:\/\.-]+['"]\)/,
      /appendPattern\(['"][yMdHms:\/\.-]+['"]\)/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /@js-joda\/core/,
      /@js-joda\/timezone/,
      /@js-joda\/locale/,
      /js-joda(?:\.min)?\.js$/,
      /js-joda\.[a-f0-9]+\.js$/,
    ],
  },
];
