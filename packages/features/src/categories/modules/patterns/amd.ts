export const amd = [
  {
    name: 'definePatterns' as const,
    score: 0.3,
    runtime: [
      // Basic define patterns
      /define\s*\(\s*["'][^"']+["']\s*,\s*\[/, // Named module with dependencies
      /define\s*\(\s*\[[^\]]*\]\s*,\s*function/, // Anonymous module with dependencies
      /define\s*\(\s*function\s*\(/, // Simple module definition

      // Common dependency patterns
      /define\s*\(\s*\[\s*["']require["']\s*,\s*["']exports["']\s*,\s*["']module["']\s*\]/,
      /define\s*\(\s*\[\s*["']exports["']\s*\]/,

      // Minified variants
      /define\(["'][^"']+["'],\[/,
      /define\(\[[^\]]*\],function/,
      /define\(function\(/,
    ],
  },
  {
    name: 'exports' as const,
    score: 0.3,
    runtime: [
      // Return object exports
      /return\s*\{\s*[^}]*\}/, // return { ... }
      /return\s*\(\s*\{\s*[^}]*\}\s*\)/, // return ({ ... })

      // Direct exports assignment
      /exports\.\w+\s*=/, // exports.something =
      /exports\[["']\w+["']\]\s*=/, // exports['something'] =

      // Return constructor/class
      /return\s+function\s*\w*\s*\(/, // return function()
      /return\s+class\s*\w*\s*\{/, // return class

      // CommonJS-wrapped exports
      /module\.exports\s*=/, // module.exports =
      /exports\s*=\s*[^;]+/, // exports = something

      // Minified variants
      /return{/,
      /exports\.\w+=/,
      /return function\(/,
      /return class\{/,
    ],
  },
  {
    name: 'dynamicExports' as const,
    score: 0.2,
    runtime: [
      // Dynamic property assignment
      /Object\.defineProperty\s*\(\s*exports\s*,/,
      /Object\.defineProperties\s*\(\s*exports\s*,/,

      // Factory returns
      /factory\s*\(\s*(?:require\s*,\s*)?exports\s*,\s*module\)/,
      /factory\.call\s*\(\s*this\s*,\s*(?:require\s*,\s*)?exports\)/,

      // Conditional exports
      /typeof\s+exports\s*===?\s*["']object["']/,
      /typeof\s+define\s*===?\s*["']function["']/,

      // Minified patterns
      /\w+\.define\(/,
      /\w+\.exports\./,
    ],
  },
];
