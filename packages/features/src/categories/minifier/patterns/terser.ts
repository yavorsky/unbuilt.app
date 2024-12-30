export const terser = [
  {
    name: 'compilation' as const,
    score: 0.2,
    scripts: [
      // Terser's unique module wrapper pattern with strict mode
      // More specific to avoid false positives with other minifiers
      /\(\s*function\s*\(\s*\w+\s*,\s*\w+\s*,\s*\w+\s*\)\s*\{\s*["']use strict["']\s*;(?:\s*var\s+\w+\s*=\s*\w+\.exports\s*=\s*\{\})?/,

      // Terser's distinctive global object detection
      /\)\s*\(\s*(?:this\s*,\s*)?(?:typeof\s+self\s*!==\s*["']undefined["']\s*\?\s*self\s*:\s*this|\s*function\s*\(\s*\)\s*\{\s*return\s+this\s*\}\s*\(\s*\))\s*\|\|\s*Function\s*\(["']return this["']\)\s*\(\s*\)/,

      // Terser's class transformation patterns
      // More specific class-related patterns
      /(?:class|function)\s+\w+\s*extends\s*null\s*\{\s*constructor\s*\(\)\s*\{\s*super\(\)\s*\}/,
      /Object\.defineProperties\(\w+\.prototype,\{(?:[^{}]|\{[^{}]*\})*\}\)/,

      // Terser's specific async/await transformations
      /async\s+function\s*\*?\s*\w*\s*\([^)]*\)\s*\{\s*(?:return\s+)?await\s+/,
      /Promise\.resolve\(\)\s*\.then\s*\(\s*function\s*\(\)\s*\{\s*return\s+/,

      // Terser's unique property access optimizations
      // More specific to Terser's property mangling style
      /\[\s*["'](get|set|async|[\w$]+)["']\s*\+\s*["'][\w$]+["']\s*\]/,
      /Object\.defineProperty\(\w+,\s*["'](?:__esModule|Symbol\.toStringTag)["']/,

      // Terser's specific variable declaration patterns
      // Characteristic initialization patterns
      /var\s+\w+\s*=\s*\(\s*\w+\s*=\s*\w+\s*\|\|\s*\{\}\s*\)\.[\w$]+\s*=\s*/,
      /const\s+\{(?:\w+(?:\s*:\s*\w+)?(?:\s*,\s*)?)+\}\s*=\s*\w+/,

      // Terser's unique error handling
      // More specific error handler patterns
      /try\s*\{\s*(?:return\s+)?(?:await\s+)?\w+\(\)[^}]*\}\s*catch\s*\(\s*\w\s*\)\s*\{\s*(?:return\s+)?(?:void\s+0|null)\s*\}/,

      // Terser's specific code splitting patterns
      // Dynamic import handling
      /import\s*\(\s*(?:["']\w+["']|\w+)\s*\)\.then\s*\(\s*function\s*\(\s*\w+\s*\)\s*\{/,

      // Terser's specific dead code elimination patterns
      /if\s*\(false\)\s*\{\s*(?:[^{}]|\{[^{}]*\})*\}\s*else\s*\{(?:[^{}]|\{[^{}]*\})*\}/,
    ],
  },
  {
    name: 'sourcemaps' as const,
    score: 0.2,
    scripts: [
      // Terser's specific sourcemap patterns with more context
      /\/\/# sourceMappingURL=data:application\/json;charset=utf-8;base64,[A-Za-z0-9+/=]+$/,
      /\/\*# sourceMappingURL=(?!data:).*?\.map(?:\.json)?\s*\*\/$/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    // More specific Terser-related filenames
    filenames: [
      /(?:^|\/)(?:[^.]+\.)?terser(?:\.min)?\.js$/,
      /(?:^|\/)(?:[^.]+\.)?tersed\.js$/,
      /\.terser-\d+\.\d+\.\d+\.js$/, // Version-specific pattern
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.1,
    // More specific hash patterns
    filenames: [
      /\.[a-f0-9]{8,}\.(?:chunk\.)?js$/,
      /-[a-f0-9]{8,}\.(?:min|prod)\.js$/,
      /\.(?:min|prod)\.[a-f0-9]{8,}\.js$/,
    ],
  },
];
