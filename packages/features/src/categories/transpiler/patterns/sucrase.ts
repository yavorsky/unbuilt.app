export const sucrase = [
  {
    name: 'core' as const,
    score: 1,
    runtime: [
      // Sucrase's unique module transformation pattern (with specific variable naming)
      /createCommonjsModule\s*\(\s*function\s*\(module,\s*exports\)\s*\{\s*"use strict";\s*Object\.defineProperty\(exports,\s*"__esModule",\s*\{\s*value:\s*true\s*\}\);?\s*exports\.__/,

      // Sucrase's specific import helpers with double dollar signs
      /function\s*__importStar\$\$\s*\(m\)\s*\{\s*(?:if\s*\(m\s*&&\s*m\.__esModule\)\s*return\s*m;\s*var\s*exports\s*=\s*\{\};?\s*for\s*\(var\s*k\s*in\s*m\)\s*if\s*\(k\s*!==\s*"default"\))/,

      // Sucrase's unique export naming pattern (different from other transpilers)
      /\$\$exports\.__esModule\s*=\s*true;\s*\$\$exports\.default\s*=\s*void\s*0/,
    ],
  },
  {
    name: 'transforms' as const,
    score: 1,
    runtime: [
      // Sucrase's unique ES wrapper implementation
      /function\s*__esWrapper\s*\(\)\s*\{\s*var\s*\$\$exports\s*=\s*\{\};\s*\$\$exports\.__esModule\s*=\s*true/,

      // Sucrase's specific wildcard import helper with unique error handling
      /function\s*__interopRequireWildcard\$\$\s*\(obj\)\s*\{\s*if\s*\(!obj\s*\|\|\s*typeof\s*obj\s*!==\s*['"]object['"]\s*&&\s*typeof\s*obj\s*!==\s*['"]function['"]\)/,

      // Sucrase's default export helper with specific null checking
      /function\s*__importDefault\$\$\s*\(obj\)\s*\{\s*return\s*obj\s*&&\s*obj\.__esModule\s*\?\s*obj\s*:\s*\{\s*default:\s*obj\s*\};?\s*\}/,
    ],
  },
];
