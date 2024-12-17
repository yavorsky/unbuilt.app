export const rollup = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // Core Rollup identifiers - highly specific
      /\/\*\s*Rollup\s*/i, // Rollup comment marker
      /rollup-runtime/, // Runtime identifier
      /\$inject_script\$/, // Unique Rollup injection marker
      /\/\*\s*@rollup\//, // Rollup directive
      /\/\*\s*rollup-plugin-/, // Rollup plugin marker
    ],
  },
  {
    name: 'chunk-loading' as const,
    score: 0.8,
    runtime: [
      // Chunk loading patterns specific to Rollup
      /function\s*loadBundle\s*\(/,
      /\.register\(.*,\s*chunk_\d+\)/, // Chunk registration
      /function\s*importChunk\(/, // Chunk import function
    ],
  },
  {
    name: 'dynamic-imports' as const,
    score: 0.6,
    runtime: [
      // Rollup-specific dynamic import patterns
      /Promise\.resolve\((?:\['"][^'"]+['"]\])?\)\.then\(function\s*\([^)]*\)\s*{\s*return\s*__rollup/,
    ],
  },
  {
    name: 'output' as const,
    score: 0.3,
    filenames: [
      // Rollup-specific output patterns
      /\w+\.(?:es|umd|iife)\.js$/, // Rollup's specific module formats
    ],
  },
];
