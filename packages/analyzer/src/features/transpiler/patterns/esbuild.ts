export const esbuild = [
  {
    name: 'transpilation' as const,
    score: 0.2,
    runtime: [
      // esbuild transpilation markers (vs bundling)
      /\/\*\s*esbuild-transpile\s*\*\//,
      /__require\.resolve/,

      // Class transformations
      /(?:this\.)?constructor\.bind\(this\)/,
      /\.bind\(this\)/,
      /\[\s*"__esModule"\s*\]\s*=\s*\{\s*value:\s*true\s*\}/,

      // JSX transforms (esbuild specific)
      /import\s*\{\s*jsx\s*\}\s*from\s*["']react\/jsx-runtime["']/,
      /\$\$\$\$jsx\b/,
      /React\.createElement\(/,
      /jsx\(\s*[A-Za-z_$][\w$]*\s*,/,

      // TypeScript transforms
      /\[\s*Symbol\.iterator\s*\]/,
      /===\s*["']object["']\s*&&\s*obj\s*!==\s*null/,
      /Object\.defineProperty\(exports,\s*["']__esModule["']/,

      // Modern syntax transforms
      /\(\s*\.\.\.(\w+)\s*\)/, // rest parameters
      /\[\s*\.\.\.(\w+)\s*\]/, // spread operator
      /\?\.[(\w$)]/, // optional chaining
      /\?\?\s*/, // nullish coalescing

      // Async/await transforms
      /async\s*function\s*\w*\s*\(/,
      /await\s+Promise\.resolve/,

      // Private fields/methods
      /WeakMap\(\)/,
      /WeakSet\(\)/,
      /#private/,

      // Property access
      /__privateGet/,
      /__privateAdd/,
      /__privateSet/,
      /__privateMethod/,

      // ES Module transforms
      /exports\.__esModule\s*=\s*true/,
      /exports\.default\s*=/,
      /module\.exports\s*=/,
      /__toCommonJS/,
    ],
  },
];
