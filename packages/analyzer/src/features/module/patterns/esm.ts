export const esm = [
  {
    name: 'staticImports' as const,
    score: 0.3,
    runtime: [
      // Standard import declarations
      /import\s+\{[^}]+\}\s*from/, // import { something } from
      /import\s+\w+\s*,\s*\{[^}]+\}\s*from/, // import default, { named } from
      /import\s+\*\s+as\s+\w+\s+from/, // import * as name from
      /import\s+\w+\s+from/, // import default from
      /import\s+["'][^"']+["']/, // import "module"

      // Minified variants
      /import{[^}]+}from/,
      /import\{/,
      /import\*/,
      /from["'][^"']+["']/,
    ],
  },
  {
    name: 'dynamicImports' as const,
    score: 0.3,
    runtime: [
      // Dynamic import expressions
      /import\s*\([^)]+\)/, // import("module")
      /import\s*\(["'][^"']+["']\)/, // import("./path")
      /\(\s*\)\s*=>\s*import\s*\(/, // () => import()
      /await\s+import\s*\(/, // await import()
      /Promise\s*\.\s*all\s*\(\s*\[?\s*import\s*\(/, // Promise.all([import(

      // Minified dynamic imports
      /import\(["'][^"']+["']\)/,
      /\(\)?=>import\(/,
      /await import\(/,
    ],
  },
  {
    name: 'exports' as const,
    score: 0.3,
    runtime: [
      // Named exports
      /export\s+(?:const|let|var|class|function|interface|type)\s+\w+/, // export const x
      /export\s+\{[^}]+\}/, // export { x, y }
      /export\s+\{[^}]+\}\s+from/, // export { x } from "module"

      // Default exports
      /export\s+default\s+/, // export default x
      /export\s+default\s+function\s*\w*\s*\(/, // export default function
      /export\s+default\s+class\s*\w*\s*\{/, // export default class

      // Re-exports
      /export\s+\*\s+from/, // export * from "module"
      /export\s+\*\s+as\s+\w+\s+from/, // export * as name from "module"

      // Minified variants
      /export{[^}]+}/,
      /export{[^}]+}from/,
      /export default/,
      /export\*/,

      // Aggregate exports
      /Object\.defineProperty\s*\(\s*exports\s*,\s*['"]__esModule['"]\s*,\s*\{\s*value:\s*true\s*\}\)/,
    ],
  },
];
