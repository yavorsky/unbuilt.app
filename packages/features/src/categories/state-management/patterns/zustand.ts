export const zustand = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Zustand's unique package identifiers in UMD builds
      /zustandVanilla/,
      /zustandShallow/,
      /zustandContext/,

      // Zustand's specific error messages
      /"Seems like you have not used zustand provider as an ancestor\."/,

      // Zustand's specific console messages with exact prefixes
      /\[zustand devtools middleware\] Unsupported action format/,
      /\[DEPRECATED\] Passing a vanilla store will be unsupported in a future version\. Instead use import \{ useStore \} from 'zustand'\./,

      // Zustand's unique devtools error message
      /\[zustand devtools middleware\] Unsupported __setState action format/,
      /When using 'store' option in devtools\(\), the 'state' should have only one key/,
    ],
  },
  {
    name: 'imports' as const,
    score: 0.9,
    scripts: [
      // ESM imports
      /import\s+.*from\s+["']zustand\/vanilla["']/,
      /import\s+.*from\s+["']zustand\/react["']/,
      /import\s+.*from\s+["']zustand\/shallow["']/,

      // CommonJS requires
      /require\(["']zustand\/vanilla["']\)/,
      /require\(["']zustand\/react["']\)/,
      /require\(["']zustand\/shallow["']\)/,

      // Dynamic imports
      /import\(["']zustand\/vanilla["']\)/,
      /import\(["']zustand\/react["']\)/,
      /import\(["']zustand\/shallow["']\)/,

      // AMD define dependencies
      /define\(\[["']zustand\/vanilla["']\]|define\(\[["']zustand\/react["']\]|define\(\[["']zustand\/shallow["']\]/,
    ],
  },
];
