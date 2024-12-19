import { Page } from 'playwright';

export const swr = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    runtime: [
      // SWR-specific imports
      /import\s+\{[^}]*useSWR[^}]*\}\s+from\s+['"]swr['"]/,
      /import\s+\{[^}]*useSWRConfig[^}]*\}\s+from\s+['"]swr['"]/,
      /import\s+\{[^}]*useSWRInfinite[^}]*\}\s+from\s+['"]swr['"]/,
      /import\s+\{[^}]*useSWRSubscription[^}]*\}\s+from\s+['"]swr['"]/,

      // SWR-specific hooks with their unique signatures
      /useSWR\s*\(\s*\(?(?:key|\{key:)/,
      /useSWRInfinite\s*\(\s*(?:\([^)]*\)\s*=>\s*\[|getKey)\s*(?:.*page\b|.*index\b)/,
      /useSWRSubscription\s*\(\s*[^,]*,\s*\([^)]*\)\s*=>\s*\{\s*\bsubscribe\b/,

      // SWR-specific configuration options
      /SWRConfig\s+value=\{\{[^}]*(?:revalidateOnFocus|revalidateIfStale|revalidateOnReconnect|revalidateWhenOffline):\s*(?:true|false)/,
      /fallbackData:\s*(?:unstable_)?serialize\(/,
      /(?:unstable_)?serialize\(\s*fallback[,\s}]]/,

      // SWR-specific cache prefixes and keys
      /\$inf\$.*?\$(?:cur|pre|cnt)\$/, // SWR infinite key pattern
      /\$req\$.*?\$err\$/, // SWR request key pattern

      // SWR-specific preload function
      /preload\s*\(\s*['"`][^'"`]+['"`]\s*,\s*fetcher[),]/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- No need to type-check SWR object
        const hasSWRFeatures = (obj: any) => {
          return (
            obj &&
            typeof obj === 'object' &&
            'INFINITE_PREFIX' in obj && // SWR-specific prefix
            'preset' in obj && // SWR cache preset
            obj.INFINITE_PREFIX === '$inf$'
          ); // Exact SWR prefix match
        };

        return !!(
          window.__SWR_CACHE_PROVIDER__ ||
          window.__SWR_DEVTOOLS_HOOK__ ||
          Object.values(window).some(hasSWRFeatures)
        );
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.3,
    runtime: [
      // SWR-specific cache operations
      /unstable_serialize\s*\(\s*\[[^\]]*\]\s*\)/,

      // SWR-specific infinite loading patterns
      /setSize\s*\(\s*(?:size\s*=>\s*size\s*\+\s*1|previousSize\s*=>\s*previousSize\s*\+\s*1)\s*\)/,

      // SWR-specific mutation patterns
      /mutate\s*\(\s*\{?\s*matcher:\s*(?:\/|['"`])[^}'"`]+(?:\/|['"`])\s*\}?/,

      // SWR-specific comparison functions
      /compare:\s*unstable_stable(?:Serialize|Hash)/,

      // SWR-specific options
      /shouldRetryOnError:\s*(?:true|false)/,
      /isOnline\(\s*\)\s*{\s*return\s*!SWR_GLOBAL_ERROR/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // SWR-specific library files
      /(?:^|\/)swr(?:\.min)?\.mjs$/i,
      /(?:^|\/)swr(?:\.min)?\.cjs$/i,

      // SWR-specific build artifacts
      /swr\.development\.js$/i,
      /swr\.production\.min\.js$/i,

      // SWR middleware files (specific to SWR implementation)
      /swr-middleware-(?:logger|devtools|immutable)\.js$/i,

      // SWR config files with SWR-specific naming
      /swr\.config\.[jt]s$/i,
    ],
  },
];
