export const luxon = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Luxon's specific error messages with exact format that won't appear in other libraries
      /"Zone required with IANA name"/,
      /"Unique zone required"/,
      /"Can't subtract an invalid DateTime"/,
      /"Missing locale data for "/,

      // Luxon's unique internal validation messages
      /"Could not create DateTime from invalid JSON"/,
      /"Numbers in toRelative\(\) are required to be Integers"/,

      // Luxon's unique instance marker
      /isLuxonDateTime:\s*true/,

      // Luxon's specific error class patterns
      /"Zone is an abstract class"/,

      // Luxon's specific formatting implementation
      /formatToParts\([^)]*\).*?timeZoneName.*?offsetName/,
      /type\s*===\s*"timeZoneName"/,
    ],
  },
  {
    name: 'errorSystem' as const,
    score: 0.8,
    scripts: [
      // Luxon's error inheritance pattern
      /LuxonError\s*=.*?function.*?_Error\)/,
      /inheritsLoose\([^,]+,\s*_Error\)/,
    ],
  },
  {
    name: 'infoClass' as const,
    score: 0.9,
    scripts: [
      // Luxon's Info class usage - completely unique to Luxon
      /Info\.features\(\)\.zones/,
      /Info\.features\(\)\.intl/,
      /Info\.features\(\)\.relative/,
      /Info\.meridiems\(/,
    ],
  },
  {
    name: 'dateTimeConfig' as const,
    score: 0.8,
    scripts: [
      // Luxon's unique DateTime configuration patterns
      /\{numberingSystem:\s*["'][^"']+["'],\s*outputCalendar:\s*["'][^"']+["']\}/,
      /\{conversionAccuracy:\s*["']casual["']\}/,

      // Luxon's specific Settings usage
      /Settings\.throwOnInvalid\s*=\s*true/,
      /Settings\.defaultZone\s*=/,
    ],
  },
];
