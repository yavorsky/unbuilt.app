export const less = [
  {
    name: 'guardCompilation' as const,
    score: 0.3,
    stylesheets: [
      // Less-unique guard patterns (not found in any other preprocessor)
      /\.-?[_a-zA-Z][\w-]*\[default\]\{/, // Default guard compilation
      /\.-?[_a-zA-Z][\w-]*\[[\w\s><=!]+\]\{/, // Compiled guard expressions
      /when\(iscolor\([@\w-]+\)\)/, // Less-specific type guards
    ],
  },
  {
    name: 'extendCompilation' as const,
    score: 0.3,
    stylesheets: [
      // Less-specific extend compilation markers
      /\[data-less-[\da-f]{8}\]/, // Less's unique hash format
      /less-[\da-f]{8}-extend/, // Less's extend compilation marker
      /\.-?[_a-zA-Z][\w-]*e\[[\da-f]{8}\]/, // Less's extend pattern
    ],
  },
  {
    name: 'lessSpecificPatterns' as const,
    score: 0.3,
    stylesheets: [
      // Less's unique property merging
      /\+\s*_[\da-f]{8}(?!\w)/, // Less's merge marker

      // Less's unique plugin pattern
      /@plugin\s+"less-plugin-[\w-]+";/,

      // Less's unique dynamic property name compilation
      /--less-[\da-f]{8}-prop/,
    ],
  },
];
