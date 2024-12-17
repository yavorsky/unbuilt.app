export const babelMinify = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Babel-minify specific function wrapping
      /"use strict";(?:\s*var\s+\w+\s*=\s*)?function\s*\(/,
      /Object\.defineProperty\(exports,\s*"__esModule"/,

      // Babel-minify variable patterns
      /_\w+\d+/, // Underscore prefix with number suffix
      /\b[A-Z]\w*_\b/, // Capital with underscore suffix
      /\$[A-Z]\w*\b/, // Dollar prefix with capital

      // Class transformation patterns
      /_classCallCheck\(/,
      /_createClass\(/,
      /_possibleConstructorReturn\(/,

      // Babel-minify's module wrapping
      /module\.exports\s*=\s*(?:void\s*)?/,
      /exports\.default\s*=\s*/,

      // Specific to Babel decorators
      /_decorate\(/,
      /_initializerDefineProperty\(/,

      // Babel-specific constant folding
      /\|\|\s*void\s*0/,
      /===?\s*void\s*0/,

      // Source map pattern
      /\/\/# sourceMappingURL=data:application\/json;charset=utf-8;base64,/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    // Not a high chance someone called it like this, but still possible
    filenames: [/\.babel\.min\.js$/, /\.babili\.js$/, /babel-min\.js$/],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [/\.min\.js$/, /\.[a-f0-9]{8}\.js$/],
  },
];
