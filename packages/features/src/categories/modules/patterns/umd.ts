export const umd = [
  {
    name: 'wrapperPattern' as const,
    score: 0.3,
    runtime: [
      // Core UMD wrapper checks
      /typeof\s+define\s*===?\s*["']function["']\s*&&\s*define\.amd/,
      /typeof\s+exports\s*===?\s*["']object["']/,
      /typeof\s+module\s*!==?\s*["']undefined["']/,
      /typeof\s+root\s*!==?\s*["']undefined["']/,

      // Factory patterns
      /\(\s*function\s*\(\s*(?:root,\s*)?factory\s*\)/,
      /\(\s*function\s*\(\s*global\s*,\s*factory\s*\)/,

      // Minified variants
      /function\(\w+,\w+\){/,
      /\btypeof exports\b.*\btypeof module\b/,
      /\btypeof define\b.*\bdefine\.amd\b/,
    ],
  },
  {
    name: 'definitions' as const,
    score: 0.3,
    runtime: [
      // Module definitions
      /define\s*\(\s*["'][^"']+["']\s*,\s*\[/,
      /define\s*\(\s*\[[^\]]*\]\s*,\s*function/,
      /define\s*\(\s*function\s*\(/,

      // Root assignments
      /root\[\s*["'][^"']+["']\s*\]\s*=/,
      /this\[\s*["'][^"']+["']\s*\]\s*=/,
      /global\[\s*["'][^"']+["']\s*\]\s*=/,

      // Common export patterns
      /module\.exports\s*=\s*factory/,
      /exports\s*=\s*factory/,
      /define\.amd\s*=/,
    ],
  },
  {
    name: 'factoryExecutions' as const,
    score: 0.2,
    runtime: [
      // Factory execution patterns
      /factory\s*\(\s*(?:root|global|this|window)\s*\)/,
      /factory\s*\(\s*(?:exports|module)?\s*,\s*(?:exports|module)?\s*\)/,

      // Common dependency injections
      /\[\s*["']require["']\s*,\s*["']exports["']\s*,\s*["']module["']\s*\]/,
      /\[\s*["']exports["']\s*,\s*["']module["']\s*\]/,

      // Minified patterns
      /factory\(\w+(?:,\w+)*\)/,
      /\[["']require["'],["']exports["']\]/,
    ],
  },
];
