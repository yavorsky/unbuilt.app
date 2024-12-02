export const terser = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Terser-specific function wrapping patterns
      /\(\s*function\s*\(\s*\w+\s*,\s*\w+\s*,\s*\w+\s*\)\s*\{\s*["']use strict["']\s*;/,
      /\)\s*\(\s*this\s*,\s*(?:function|void)\s*\(\s*\)\s*\{\s*return\s+this\s*\}\s*\(\s*\)\s*\|\|\s*Function\s*\(['"]\w+this["']\)\s*\(\s*\)\s*,/,

      // Terser-specific variable naming
      /\b[a-z]{1,2}\b(?=\[|\(|\.|=)/,  // Single/double letter variables
      /\b[A-Z][a-zA-Z]?\b(?=\[|\(|\.|=)/,  // Capital letter variables

      // Terser's unique source map comments
      /\/\/# sourceMappingURL=data:application\/json;base64,[A-Za-z0-9+/=]+\s*$/,
      /\/\*# sourceMappingURL=.*\.map\s*\*\/$/,

      // Terser's function name mangling pattern
      /function\s+[A-Z_][A-Z0-9_]*/,

      // Terser's specific boolean simplification
      /!\s*0|!\s*1|void\s+0/,
      /===?\s*(?:!0|!1|void 0)/,

      // Unique to Terser's property mangling
      /\[\s*["']\w+['"]\s*\+\s*["']\w+["']\s*\]/,

      // Terser's specific try-catch optimization
      /try\s*\{\s*\w+\s*\(\s*\)\s*\}\s*catch\s*\(\s*\w\s*\)\s*\{\s*\}/
    ]
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    // Not a high chance someone called it like this, but still possible
    filenames: [
      /\.terser\.js$/
    ]
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /\.[a-f0-9]{8,}\.js$/,
      /-[a-f0-9]{8,}\.min\.js$/
    ]
  }
 ]