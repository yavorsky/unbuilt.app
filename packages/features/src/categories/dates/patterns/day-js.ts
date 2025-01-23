export const dayJs = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // day.js specific instance marker
      /\$isDayjsObject/,
      /\["\\$isDayjsObject"\]/,
      // day.js specific combination of internal properties
      // Multiple properties must exist together to avoid false positives
      /\.\$L.*\.\$d.*\.\$y.*\.\$M/,
      /\.\$y.*\.\$M.*\.\$D.*\.\$W.*\.\$H/,
    ],
  },
  {
    name: 'pluginSystem' as const,
    score: 0.9,
    scripts: [
      // day.js specific plugin registration - won't match moment plugins
      /dayjs\.extend\([^)]+\)/,
      // Specific day.js plugin names in extend
      /extend\((?:customParseFormat|updateLocale|relativeTime|isoWeek)\)/,
    ],
  },
  {
    name: 'errorHandling' as const,
    score: 0.8,
    scripts: [
      // day.js specific invalid date constant
      /"Invalid Date"===\w+\.\$d\.toString\(\)/,
      /"Invalid Date"===\w+\.toString\(\)/,
      // day.js specific plugin error
      /"plugin conflict"|"plugin function is required"|"plugin name is required"/,
    ],
  },
];
