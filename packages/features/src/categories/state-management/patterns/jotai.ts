export const jotai = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Jotai's unique error messages that survive minification
      /"setSelf function cannot be used with read-only atom"/,
      /"setSelf function cannot be called in sync"/,
      /"atom not writable"/,
      /"no atom init"/,

      // Jotai's unique atom key generation
      /"atom\d+"/,
    ],
  },
  {
    name: 'storeImplementation' as const,
    score: 0.8,
    scripts: [
      // Jotai's store implementation details that survive minification
      /atomStateMap\s*=\s*new\s*WeakMap/,
      /mountedMap\s*=\s*new\s*WeakMap/,
      /cancelPromiseMap\s*=\s*new\s*WeakMap/,
    ],
  },
  {
    name: 'moduleImports' as const,
    score: 0.7,
    scripts: [
      // Jotai's unique module imports
      /from\s+["']jotai\/vanilla["']/,
      /from\s+["']jotai\/devtools["']/,
      /require\(["']jotai\/vanilla["']\)/,
      /require\(["']jotai\/devtools["']\)/,
    ],
  },
];
