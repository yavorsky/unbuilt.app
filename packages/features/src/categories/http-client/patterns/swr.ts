export const swr = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // SWR's core mutation cache implementation - exists in the library code
      /\[\["finite",1],\["revalidateOnFocus",1],\["revalidateOnReconnect",1],\["refreshInterval",0]]/,

      // SWR's default fetcher error pattern - part of core implementation
      /"No fetcher function matched/,

      // SWR's internal events broadcast - part of core implementation
      /"broadcast\([^)]*\):"/,

      // SWR's core serialization helper for cache keys
      /"serialized key: "/,

      // SWR's internal event keys - part of the core
      /"focus","visibilitychange","online","offline"/,
    ],
  },
  {
    name: 'cacheStateMarkers' as const,
    score: 0.9,
    scripts: [
      // SWR's unique internal cache key format
      /\$swr\$.*?\$cache\$/,
      /\$cache\$\/.*?\$swr\$/,
    ],
  },
  {
    name: 'buildOutputs' as const,
    score: 0.3,
    filenames: [
      // SWR-specific build artifacts
      /swr(?:\.min)?\.js$/i,
      /swr\.[a-f0-9]{8,}\.js$/i,
      /use-swr\.[a-f0-9]{8,}\.js$/i,
    ],
  },
];
