export const babelMinify = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Babel-minify specific helper functions
      // These are more unique to Babel's transforms
      /_createSuper\(\s*[a-zA-Z_$][\w$]*\s*\)/,
      /_isNativeReflectConstruct\(\s*\)/,
      /_createForOfIteratorHelper\(/,

      // Babel class transformation patterns
      // More specific to avoid conflicts with other transpilers
      /function\s+_createClass\(Constructor,\s*protoProps(?:\s*,\s*staticProps)?\)\s*{/,
      /function\s+_classCallCheck\(instance,\s*Constructor\)\s*{/,

      // Babel decorator patterns with more specific context
      /_initializerDefineProperty\(\s*this\s*,\s*[a-zA-Z_$][\w$]*\s*,\s*_descriptor/,
      /_defineProperty\(this,\s*[a-zA-Z_$][\w$]*\s*,\s*_descriptor\./,

      // Babel-specific module transforms
      // Added more context to avoid false positives
      /Object\.defineProperty\(exports,\s*"__esModule",\s*{\s*value:\s*true\s*}\)/,
      /exports\.__esModule\s*=\s*true/,

      // Babel-specific async/await helpers
      /_asyncToGenerator\(\s*function\s*\*/,
      /_awaitAsyncGenerator\(/,

      // Babel-specific variable declarations
      // More restrictive to avoid common patterns
      /var\s+_ref\d+\s*=\s*_asyncToGenerator\(/,
      /var\s+_super\s*=\s*_getPrototypeOf\(/,

      // Source map pattern specific to Babel's output
      /\/\/# sourceMappingURL=data:application\/json;base64,[A-Za-z0-9+/]+=*/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    // More specific to babel-minify
    filenames: [
      /\.babel\.min\.js$/,
      /\.babili\.js$/,
      /(?:^|\/)babel-min\.[a-f0-9]{8}\.js$/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.1, // Reduced score as these are less specific
    filenames: [
      /\.min\.[a-f0-9]{8}\.js$/, // More specific hash pattern
      /\.[a-f0-9]{8}\.min\.js$/, // Alternative hash position
    ],
  },
];
