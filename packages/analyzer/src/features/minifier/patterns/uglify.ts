export const uglify = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // UglifyJS specific function wrapping
      /^!function\([\w,]+\)\{/,
      /\}\((?:window|this|\w+)\)/,

      // UglifyJS variable naming patterns
      /\b[a-z]\b(?=[\.\[\(])/,  // Single letter variables
      /\b[a-z]{2}\b(?=[\.\[\(])/,  // Two letter variables
      /\b[a-z]_\b/,  // letter_underscore pattern

      // UglifyJS-specific boolean handling
      /!1|!0/,  // Prefers this over void 0
      /void 0/,

      // Function declaration pattern
      /function\s+\w\s*\([^)]*\)\s*\{/,

      // UglifyJS specific property access
      /\[\s*['"][^'"]+['"]\s*\]/,

      // UglifyJS's specific try-catch naming
      /try\s*\{\s*\w\s*\(\s*\)\s*\}\s*catch\s*\(\s*\w\s*\)\s*\{\}/,

      // Variable scope wrapping specific to UglifyJS
      /,function\(\)\{/,
      /\}\.call\(this\)/,

      // UglifyJS's comment preservation pattern
      /\/\*![\s\S]*?\*\//
    ]
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    // Not a high chance someone called it like this, but still possible
    filenames: [
      /\.uglify\.js$/,
      /uglified\.js$/,
      /-uglified\.js$/
    ]
  },
  {
    name: 'chunks' as const,
    score: 0.1,
    filenames: [
      /\.min\.js$/,
      /\.[a-f0-9]{8}\.js$/,
      /-min\.js$/
    ]
  }
];
