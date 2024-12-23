export const uglify = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // UglifyJS specific IIFE patterns with more context
      // More specific wrapper pattern with optional strict mode
      /^!function\(([a-z],)*[a-z]\)\{"use strict";(?:var [a-z]=)?/,
      // Distinctive end-of-file pattern
      /\}\.call\(this\)\}\.call\(this,(?:typeof global!=="undefined"\?global:)?(?:typeof self!=="undefined"\?self:)?this\)\s*$/,

      // UglifyJS specific optimizations
      // Function definitions with single-letter names and minimal spacing
      /function [a-z]\([^)]*\){(?:[^{}]|\{[^{}]*\})*}/,
      // UglifyJS's characteristic ternary pattern
      /(?:[a-z]\.[a-z]\?[a-z]\.[a-z]=[a-z]:[a-z]\.[a-z]=![0-9];)/,

      // UglifyJS's distinctive error handling
      // More specific try-catch with UglifyJS's characteristic style
      /try\{(?:[^{}]|\{[^{}]*\})*\}catch\([a-z]\)\{(?:void 0|return null)\}/,

      // UglifyJS's module pattern
      // More specific module wrapper with UglifyJS's style
      /\(function\(module,exports(?:,[a-z])*\)\{(?:[^{}]|\{[^{}]*\})*\}\)/,

      // UglifyJS's distinctive property access patterns
      // More specific bracket notation with optional quotes
      /\[["`'](?:(?!1).)+1\](?=\s*[:=])/,

      // UglifyJS's specific comment preservation
      // License comment preservation with UglifyJS's formatting
      /\/\*!(?:\s*@preserve|\s*@license|\s*@cc_on|\s*@copyright)\b[\s\S]*?\*\//,

      // UglifyJS's specific variable declaration patterns
      // Characteristic comma-first style in var declarations
      /var [a-z](?:,[a-z])*=(?:[^;]+,)*[^;]+;/,

      // UglifyJS's specific boolean optimizations
      // More contextual boolean patterns
      /(?:return|case|===?|!==?)(?:\s*!0|\s*!1)(?![0-9a-z])/,

      // UglifyJS's specific function call patterns
      // Characteristic immediate function call pattern
      /\([a-z]=[a-z]\([^)]*\),([a-z],)*[a-z]\)/,

      // UglifyJS's sourcemap pattern
      // More specific sourcemap comment
      /\/\/# sourceMappingURL=[a-zA-Z0-9+/]+={0,2}$/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    // More specific UglifyJS filename patterns
    filenames: [
      /(?:^|\/)(?:[^.]+\.)?uglify(?:js)?\.(?:min\.)?js$/,
      /(?:^|\/)(?:[^.]+\.)?uglified(?:\.min)?\.js$/,
      /(?:^|\/)[^.]+\.ugly\.js$/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.1,
    // More specific generic minified patterns
    filenames: [
      /\.min\.[a-f0-9]{8}\.js$/,
      /\.[a-f0-9]{8}\.min\.js$/,
      /(?:^|\/)[^.]+?-min-[a-f0-9]{8}\.js$/,
    ],
  },
];
