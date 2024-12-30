export const prepack = [
  {
    name: 'compilation' as const,
    score: 0.2,
    scripts: [
      // Prepack's unique initialization patterns
      // More specific require pattern with context
      /__prepack_require__\(\s*[0-9]+\s*\)\.default/,
      /__prepack_require__\(\s*"[^"]+"\s*\)/,

      // Prepack's distinctive function evaluation
      /__evaluatePureFunction\s*\(\s*function\s*\([^)]*\)\s*\{/,
      /\(\s*0\s*,\s*eval\s*\)\s*\(\s*["'][^"']+["']\s*\)/,

      // Prepack's specific object freezing and property definitions
      // More specific patterns with property descriptors
      /Object\.freeze\(\{\s*(?:(?:[$\w]+)\s*:\s*(?:[^,{}]|\{[^{}]*\})+\s*,?\s*)+\}\)/,
      /Object\.defineProperties\(\s*[^,]+\s*,\s*\{\s*[$\w]+\s*:\s*\{\s*(?:value|get|configurable|enumerable|writable):/,

      // Prepack's specific constant inlining
      // More contextual constant folding
      /\[\s*\.\.\.(?:Array|new\s+Array)\(\s*[0-9]+\s*\)\.(?:map|fill)\(/,
      /Array\.from\(\{\s*length\s*:\s*[0-9]+\s*\}\s*,\s*function\s*\([^)]*\)\s*\{/,

      // Prepack's specific dead code elimination
      // More specific patterns for eliminated code
      /(?:void\s+function\s*\([^)]*\)\s*\{\s*[^}]*\}|void\s+class\s+\w+\s*\{[^}]*\})/,
      /if\s*\(\s*false\s*\)\s*\{\s*[^}]*\}\s*(?:else\s*\{\s*)?/,

      // Prepack's specific variable declarations
      // More specific naming patterns with context
      /var\s+_\$[0-9]+\s*=\s*(?:Object\.freeze|Object\.assign)\(/,
      /const\s+\$[A-Z][0-9]+\s*=\s*(?:Symbol|Object\.create)\(/,

      // Prepack's specific optimizations
      // Known value substitutions with more context
      /\{\s*"value"\s*:\s*(?:[^{}]|\{[^{}]*\})+\s*,\s*"(?:writable|configurable|enumerable)"\s*:\s*(?:true|false)\s*\}/,
      /Math\.[A-Z_]+(?:\s*\.\s*(?:toFixed|toPrecision)\s*\([0-9]+\)|\s*\([^)]*\))?/,

      // Prepack's specific module handling
      /module\.exports\s*=\s*\{\s*(?:[$\w]+\s*:\s*(?:[^,{}]|\{[^{}]*\})+\s*,?\s*)+\s*\}/,

      // Prepack's specific runtime checks
      /typeof\s+(?:global|window)\s*!==\s*["']undefined["']/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    // More specific Prepack-related filenames
    filenames: [
      /(?:^|\/)(?:[^.]+\.)?prepack(?:\.min)?\.js$/,
      /(?:^|\/)(?:[^.]+\.)?prepack-\d+\.\d+\.\d+\.js$/, // Version-specific pattern
      /(?:^|\/)[^.]+\.prepacked\.js$/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.1,
    // More specific optimization-related patterns
    filenames: [
      /\.optimized\.[a-f0-9]{8}\.js$/,
      /\.[a-f0-9]{8}\.optimized\.js$/,
      /(?:^|\/)[^.]+?-optimized-[a-f0-9]{8}\.js$/,
    ],
  },
];
