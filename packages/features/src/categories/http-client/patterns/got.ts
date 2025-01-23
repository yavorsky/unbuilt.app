export const got = [
  {
    name: 'uniqueMarkers' as const,
    score: 0.9,
    scripts: [
      // Got-specific pagination methods - unique to Got
      /\.paginate\.all\(\)/,
      /\.paginate\.each\(\)/,
    ],
  },
  {
    name: 'hookEvents' as const,
    score: 0.8,
    scripts: [
      // Got's unique combination of hook events in this exact format
      /'beforeRequest'\s*,\s*function/,
      /'beforeRedirect'\s*,\s*function/,
      /'beforeRetry'\s*,\s*function/,
      /'beforeError'\s*,\s*function/,
    ],
  },
  {
    name: 'headerSignatures' as const,
    score: 0.6,
    headers: {
      // Got-specific retry header
      'x-got-retry-count': /^\d+$/,
    },
  },
  {
    name: 'buildOutputs' as const,
    score: 0.3,
    filenames: [
      // Got-specific build artifacts
      /got(?:\.min)?\.js$/i,
      /got\.[a-f0-9]{8,}\.js$/i,
    ],
  },
];
