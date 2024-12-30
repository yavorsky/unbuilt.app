export const esbuild = [
  {
    name: 'compilation' as const,
    score: 0.2,
    scripts: [
      /(?:var|let|const)\s+[a-z]\s*=\s*(?:class|function)/,
      /(?:var|let|const)\s+[a-z]\s*=\s*\([a-z]\)\s*=>/, // Arrow functions
      // esbuild's specific module system patterns
      // More specific CommonJS handling
      /__commonJS\(\{\s*(?:"[^"]+"|'[^']+')\s*:\s*\(module(?:\s*,\s*exports)?\)\s*=>\s*\{/,
      /__toESM\(\s*require\(\s*(?:"[^"]+"|'[^']+')\s*\)(?:\s*,\s*\d+)?\s*\)/,

      // esbuild's specific export handling
      /__export\(\s*exports\s*,\s*\{\s*(?:[$\w]+\s*:\s*(?:\(\)\s*=>\s*[$\w]+|\[\s*\]|\{\s*\}|[$\w]+)\s*,?\s*)+\s*\}\s*\)/,
      /Object\.defineProperty\(exports,\s*(?:"__esModule"|'__esModule')\s*,\s*\{\s*value:\s*true\s*\}\)/,

      // esbuild's specific import handling
      // More specific dynamic import patterns
      /__dynamic_import\(\s*(?:"[^"]+"|'[^']+')\s*,\s*\d+\s*,\s*\d+\s*,\s*\{\s*/,
      /import\.meta\.(?:url|env|resolve|hot)/,
      /import\(\s*\/\*\s*webpackChunkName:\s*"[^"]+"\s*\*\/\s*"[^"]+"\)/,

      // esbuild's specific variable naming with context
      // More specific naming patterns
      /const\s+\$\w+\$\d+\s*=\s*\(\)\s*=>\s*import\(/,
      /let\s+\$[0-9a-f]{1,6}\$\s*=\s*\{\s*[\w$]+:\s*\d+\s*\}/,

      // esbuild's specific error handling
      // More specific error patterns with context
      /__error\(\s*new\s+Error\(\s*(?:"[^"]+"|'[^']+')\s*\)\s*\)/,
      /__throws\(\s*(?:"[^"]+"|'[^']+')\s*,\s*TypeError\s*\)/,
      /__load_error\(\s*Error\(\s*(?:"[^"]+"|'[^']+')\s*\)\s*,\s*\d+\s*,\s*\d+\s*\)/,

      // esbuild's specific code splitting patterns
      /Promise\.all\(\s*\[\s*(?:__import\([^)]+\)\s*,?\s*)+\]\s*\)/,
      /chunk_\w+\s*=\s*__import\(/,

      // esbuild's specific runtime helpers
      /__rest\(\s*\{\s*(?:[\w$]+\s*,\s*)*[\w$]+\s*\}\s*,\s*\[[^\]]+\]\s*\)/,
      /__objRest\(\s*\{\s*(?:[\w$]+\s*,\s*)*[\w$]+\s*\}\s*,\s*\[[^\]]+\]\s*\)/,

      // esbuild's specific TypeScript handling
      /__decorateClass\(\s*\[\s*(?:[\w$]+(?:\([^)]*\))?\s*,?\s*)*\]\s*,\s*[\w$]+\s*\)/,
      /__propKey\(\s*(?:"[^"]+"|'[^']+')\s*\)/,
    ],
  },
  {
    name: 'sourcemaps' as const,
    score: 0.3,
    scripts: [
      // More specific sourcemap patterns
      /\/\/# sourceMappingURL=data:application\/json;base64,[A-Za-z0-9+/=]+?(?:[A-Za-z0-9+/=]*?esbuild[A-Za-z0-9+/=]*?)$/,
      /\/\*# sourceMappingURL=(?!data:).*?\.map\.js(?:\?v=\w+)?\s*\*\/$/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    // More specific esbuild-related filenames
    filenames: [
      /(?:^|\/)(?:[^.]+\.)?esbuild(?:\.min)?\.js$/,
      /(?:^|\/)(?:[^.]+\.)?esbuild-\d+\.\d+\.\d+\.js$/, // Version-specific pattern
      /\.esbuild\.(?:esm|cjs|iife)\.js$/, // Module format specific
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.1,
    // More specific bundle patterns
    filenames: [
      /\.bundle\.[a-f0-9]{8}\.js$/,
      /\.[a-f0-9]{8}\.bundle\.js$/,
      /(?:^|\/)[^.]+?-bundle-[a-f0-9]{8}\.js$/,
    ],
  },
];
