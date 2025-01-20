export const sucrase = [
  {
    name: 'moduleSystem' as const,
    score: 0.3,
    scripts: [
      // Sucrase's unique module initialization without extra wrappers or helpers
      /exports\.__esModule\s*=\s*true;\s*exports\.\w+\s*=\s*void\s*0/,

      // Sucrase's minimal interop: direct assignment without helper functions
      /exports\.default\s*=\s*\w+;\s*module\.exports\s*=\s*exports\.default/,

      // Sucrase's unique ESM transformation style
      /exports\.\{[^}]+\}\s*=\s*\w+[;,]\s*exports\./,
    ],
  },
  {
    name: 'jsxTransform' as const,
    score: 0.3,
    scripts: [
      // Sucrase's minimal JSX transformation: direct createElement calls without wrappers
      /React\.createElement\(\s*[\w$]+,\s*(?:\{[^}]*\}|null),\s*(?:[^;,]+)\)/,

      // Sucrase's fragment handling without extra variables or helpers
      /React\.createElement\(React\.Fragment,\s*null,\s*(?:[^;,]+)\)/,
    ],
  },
  {
    name: 'classTransforms' as const,
    score: 0.25,
    scripts: [
      // Sucrase's static property assignment: direct without helpers
      /Object\.defineProperty\(\w+,\s*["']\w+["'],\s*\{\s*enumerable:\s*true,\s*value:\s*(?:[^}]+)\}\)/,
    ],
  },
  {
    name: 'optimization' as const,
    score: 0.2,
    scripts: [
      // Sucrase's optimized output: minimal variable declarations
      /var\s+(\w+)\s*=\s*(?:require\(["'][^"']+["']\)|\w+)(?:\s*,\s*\w+\s*=\s*(?:require\(["'][^"']+["']\)|\w+))*;/,

      // Sucrase's optimized destructuring: direct assignment
      /var\s*\{\s*(?:\w+\s*(?::\s*\w+)?\s*(?:,\s*\w+\s*(?::\s*\w+)?)*\s*)\}\s*=\s*\w+;/,
    ],
  },
];
