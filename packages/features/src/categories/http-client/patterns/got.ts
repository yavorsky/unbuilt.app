import { Page } from 'playwright';

export const got = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    runtime: [
      // Core Got-specific imports and instances
      /import\s+(?:\* as\s+)?got\s+from\s+['"]got['"]/,
      /require\s*\(\s*['"]got['"]\s*\)/,

      // Got-specific instance creation and extension
      /got\.extend\s*\(\s*\{[^}]*(?:prefixUrl|resolveBodyOnly|pagination|dnsCache):/,

      // Got-specific features
      /got\.paginate\s*\(\s*[^)]*\)/,
      /got\.stream\s*\(\s*[^)]*\)/,

      // Got-specific error types
      /instanceof\s+got\.(?:HTTPError|RequestError|TimeoutError|ParseError|CacheError)/,

      // Got-specific configuration options
      /(?:prefixUrl|resolveBodyOnly|isStream|pagination|dnsCache|handlers|mutableDefaults):\s*/,

      // Got-specific hooks
      /(?:beforeRequest|afterResponse|beforeRetry|beforeError):\s*\[\s*async\s*\([^)]*\)\s*=>/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- No need to type-check got object
        const isGotInstance = (obj: any) => {
          return (
            obj &&
            typeof obj === 'function' &&
            'extend' in obj &&
            'stream' in obj &&
            'paginate' in obj &&
            'defaults' in obj
          );
        };

        return !!(
          // Check for Got-specific features
          (
            (window.got && isGotInstance(window.got)) ||
            Object.values(window).some(
              (obj) =>
                isGotInstance(obj) &&
                obj.defaults?.options?.resolveBodyOnly !== undefined
            )
          )
        );
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.3,
    runtime: [
      // Got-specific configuration patterns
      /options:\s*\{\s*(?:resolveBodyOnly|isStream|pagination|dnsCache):/,

      // Got-specific error handling
      /catch\s*\(\s*error\s*\)\s*{\s*(?:if\s*\()?error\.(?:name|code)\s*===\s*['"](?:HTTPError|RequestError|TimeoutError|ParseError|CacheError)['"]/,

      // Got-specific retry configuration
      /retry:\s*\{\s*(?:limit|methods|statusCodes|errorCodes|calculateDelay):/,

      // Got-specific cache configuration
      /cache:\s*new\s+(?:Map|KeyvDefault)/,

      // Got-specific hooks implementation
      /beforeRequest:\s*\[\s*async\s*\([^)]*\)\s*=>\s*\{[^}]*\}\s*\]/,
      /afterResponse:\s*\[\s*async\s*\([^)]*\)\s*=>\s*\{[^}]*\}\s*\]/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Got-specific library files
      /(?:^|\/)got(?:\.min)?\.js$/i,
      /(?:^|\/)node_modules\/got\//i,

      // Got-specific configuration files
      /got-instance\.js$/i,
      /got-config\.js$/i,

      // Build output specific to Got
      /\bgot\.[a-f0-9]{8}\.js$/i, // Build hash pattern
    ],
  },
];
