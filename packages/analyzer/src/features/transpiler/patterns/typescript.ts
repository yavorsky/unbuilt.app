export const typescript = [{
  name: 'compilation' as const,
  score: 0.2,
  runtime: [
    // TypeScript-specific runtime helpers
    /__extends/,
    /__assign/,
    /__rest/,
    /__decorate/,
    /__param/,
    /__metadata/,
    /__awaiter/,
    /__generator/,
    /__createBinding/,
    /__exportStar/,
    /__values/,
    /__read/,
    /__spread/,
    /__spreadArrays/,
    /__spreadArray/,
    /__await/,
    /__asyncGenerator/,
    /__asyncDelegator/,
    /__asyncValues/,
    /__makeTemplateObject/,
    /__importStar/,
    /__importDefault/,

    // TypeScript-specific decorator implementation
    /__esDecorate/,
    /__runInitializers/,
    /__propKey/,

    // TypeScript enum implementation
    /\[\s*\w+\s*\["[^"]+"\]\s*=\s*\d+\s*\]/,  // enum pattern
    /Object\.defineProperty\(\s*exports,\s*"__esModule"/,

    // Source map comments
    /\/\/# sourceMappingURL=.*\.js\.map/,

    // TypeScript-specific comments
    /\/\*\s*@class\s*\*\//,
    /\/\*\s*@enum\s*\*\//,

    // Common emit patterns
    /var\s+(\w+)\s*;\s*\(\s*function\s*\(\s*\1\s*\)\s*\{/,  // namespace pattern
    /typeof\s+exports\s*===\s*['"]object['"]\s*&&\s*typeof\s+module\s*!==\s*['"]undefined['"]/,  // module check

    // TypeScript class emit patterns
    /var\s+\w+\s*=\s*\/\*\*\s*@class\s*\*\/\s*function/,
    /var\s+\w+\s*=\s*function\s*\(\s*_super\s*\)/,

    // Unique TypeScript helper usage
    /__classPrivateFieldGet/,
    /__classPrivateFieldSet/,
    /__classPrivateFieldIn/,

    // Metadata reflection
    /Reflect\.decorate/,
    /Reflect\.metadata/,

    // Common minified patterns specific to TypeScript
    /tslib\./,
    /__importStar\(/,
    /__importDefault\(/,
  ]
}];
