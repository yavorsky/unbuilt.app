export const valtio = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Valtio's unique exports and function names
      /unstable_getDeriveSubscriptions/,
      /proxyCompare\.markToTrack/,

      // Valtio's specific error/warning messages
      /'Please use proxy object'/,

      // Valtio's internal proxy markers
      /\[\$valtioRef\]/,
      /\[valtio_listeners\]/,
      /\[valtio_source\]/,
    ],
  },
  {
    name: 'proxyImplementation' as const,
    score: 0.8,
    scripts: [
      // Valtio's unique proxy handling
      /markToTrack\(snapshot,\s*true\)/,

      // Valtio's specific snapshot handling
      /snapshot\[PROMISE_SYMBOL\]/,
      /addPromiseListener/,
    ],
  },
  {
    name: 'imports' as const,
    score: 0.9,
    scripts: [
      // ESM imports
      /import\s+.*from\s+["']valtio\/vanilla["']/,
      /import\s+.*from\s+["']valtio\/utils["']/,

      // CommonJS requires
      /require\(["']valtio\/vanilla["']\)/,
      /require\(["']valtio\/utils["']\)/,

      // Dynamic imports
      /import\(["']valtio\/vanilla["']\)/,
      /import\(["']valtio\/utils["']\)/,
    ],
  },
  {
    name: 'devtools' as const,
    score: 0.7,
    scripts: [
      // Valtio's devtools integration
      /"__valtio_devtools_value__"/,
      /"__valtio_devtools_undefined__"/,
      /"__valtio_devtools_pending__"/,
    ],
  },
];
