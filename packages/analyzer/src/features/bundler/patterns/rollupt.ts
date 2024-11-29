export const rollup = [
  {
    // Core Rollup runtime patterns
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Core Rollup markers
      /\/\*\s*Rollup\s*/i,
      /rollup-runtime/,

      // Module system
      /define\(['"]exports['"],/,
      /exports\.__esModule\s*=\s*true/,
      /Object\.defineProperty\(exports,\s*['"]__esModule['"]/,
      /createCommonjsModule/,
      /commonjsRequire/,

      // Dynamic imports
      /Promise\.resolve\((?:\['"][^'"]+['"]\])?\)\.then\(function\s*\([^)]*\)\s*{\s*return\s*__rollup/,
      /import\(.*\)\.then\(/,
      /loadBundle/,
      /importModule/,

      // Code splitting
      /var\s+([a-zA-Z0-9_$]+)\s*=\s*\[.*\];\s*try\s*{\s*Promise/,
      /\$inject_script\$/,
      /function\s*importChunk\(/,

      // Asset loading
      /import\.meta\.url/,
      /new\s+URL\(.*,\s*import\.meta\.url\)/,

      // Plugin markers
      /\/\*\s*@rollup\//,
      /\/\*\s*rollup-plugin-/,

      // Chunk loading system
      /function\s*loadBundle\s*\(/,
      /\.register\(.*,\s*chunk_\d+\)/,
      /document\.createElement\(['"]script["']\)/,
      /document\.head\.appendChild\(/,
      /import\(.*chunk.*\)/,

      // AMD/UMD patterns
      /typeof\s+define\s*===\s*['"]function['"]\s*&&\s*define\.amd/,
      /\(this\.(?:\w+\.)*?\s*=\s*factory\(\)/,

      // Browser environment checks
      /typeof\s+window\s*!==\s*['"]undefined['"]/,
      /typeof\s+document\s*!==\s*['"]undefined['"]/,

      // Source maps
      /\/\/# sourceMappingURL=.*\.map/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Main bundle patterns
      /\w+\.(?:es|umd|iife)\.js$/,
      /\w+\.min\.js$/,
      /\w+\.module\.js$/,

      // Chunk patterns
      /chunks\/\w+\-[a-f0-9]{8}\.js$/,
      /assets\/\w+\-[a-f0-9]{8}\.js$/,

      // Dynamic imports
      /dynamic-imports\/\w+\.js$/,
    ],
  },
];
