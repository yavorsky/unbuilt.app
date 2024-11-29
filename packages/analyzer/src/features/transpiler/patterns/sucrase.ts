export const sucrase = [{
  name: 'compilation' as const,
  score: 0.2,
  runtime: [
    // Core Sucrase markers
    /\/\*\s*sucrase[\s\*]/i,
    /\.sucrase-cache/,

    // Unique Sucrase transforms
    /const\s+_jsxFileName\s*=/,
    /jsxDevRuntime\.jsxDEV/,
    /createReactClass/,
    /require\(\s*['"]react['"]\)/,

    // Import/export transforms (Sucrase specific)
    /_interopRequireDefault\$/,
    /_interop_require_default/,
    /_interop_require_wildcard/,
    /_createNamedExportFrom/,

    // Class transforms (minimal compared to Babel)
    /\.constructor\.bind\(this\)/,
    /\.call\(this\)/,
    /\.bind\(this\)/,

    // Flow/TypeScript stripping markers
    /\/\*::?\s*[^*]*\*\//,
    /\/\/\s*::\s*/,

    // Source map patterns
    /\/\/# sourceMappingURL=data:application\/json;base64,.*sucrase/
  ]
}];
