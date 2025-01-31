export const effector = [
  {
    name: 'coreImplementation' as const,
    score: 0.3,
    scripts: [
      // Effector's unique error messages
      /"Handlers map can contain only effects as keys"/,
      /"Values map can contain only writable stores as keys"/,

      // Effector's unique property existence checks
      /['"](family|graphite)["']\s+in\s+e/,

      // Effector's specific internal property lookups
      /\.graphite\s*\|\|\s*e/,
      /\.family\.owner/,
    ],
  },
  {
    name: 'storeImplementation' as const,
    score: 0.3,
    scripts: [
      // Effector's unique store operations
      /\{store:\s*t\.stateRef,\s*to:\s*['"]stack["']\}/,
      /\{store:\s*[^,]+,\s*to:\s*['"](?:stack|a|b)["']/,

      // Effector's unique priority system
      /priority:\s*['"](?:barrier|read)["']/,

      // Effector's specific sidMap pattern
      /\.sidMap\[O\([^,]+,\s*['"]sid["']\)\]/,
    ],
  },
];
