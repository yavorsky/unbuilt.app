export const sucrase = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // Sucrase-specific markers and helpers
      /createCommonjsModule\(function \(module, exports\)/, // Sucrase's module wrapper
      /__importStar\$\$/, // Sucrase's unique import helper
      /__importDefault\$\$/, // Sucrase's unique default import helper
      /\$\$exports/, // Sucrase's exports variable
    ],
  },
  {
    name: 'transforms' as const,
    score: 0.8,
    runtime: [
      // Sucrase's unique transform patterns
      /__esWrapper/, // Sucrase's ES modules wrapper
      /__defaultExports\$\$/, // Sucrase's default exports helper
      /__interopRequireWildcard\$\$/, // Sucrase's wildcard import helper
    ],
  },
];
