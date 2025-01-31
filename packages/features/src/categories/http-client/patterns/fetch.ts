// Fethc has lower scores, since can be used o
export const fetch = [
  {
    name: 'requestConfiguration' as const,
    score: 1,
    scripts: [
      // Basic fetch call with options object - handles minified code
      /(?:^|[^.a-zA-Z])fetch\s*\([^,)]+,\s*\{[^}]*(?:method|body|mode|credentials|keepalive|headers):/i,

      // Basic fetch calls
      /(?:^|[^.a-zA-Z])fetch\s*\([^)]+\)/,

      // Fetch's unique signal usage pattern
      /new\s+AbortController\(\)[^}]*fetch\s*\([^)]+signal:/,
    ],
  },
  {
    name: 'responseHandling' as const,
    score: 0.3,
    scripts: [
      // Specific Response.clone() usage - unique to Fetch API
      /\.clone\(\)\.(?:json|text|blob)\(\)/,

      // ReadableStream response handling - specific to Fetch
      /\.body\.getReader\(\)/,

      // Response.redirect specific to Fetch API
      /Response\.redirect\([^)]+\)/,
    ],
  },
  {
    name: 'regressionMatches' as const,
    score: -0.5,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- fix self-reference
    dependencies: (analysis: any) => {
      return ['ky', 'swr', 'urql', 'nextServerActions'].some(
        (dep) =>
          dep === analysis.httpClient.name &&
          analysis.httpClient.confidence > 0.5
      );
    },
  },
];
