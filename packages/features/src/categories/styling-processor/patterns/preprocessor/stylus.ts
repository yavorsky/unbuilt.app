export const stylus = [
  {
    name: 'uniqueSyntax' as const,
    score: 0.3,
    stylesheets: [
      // Stylus-unique bracket-less syntax
      /^[\w-]+\s+[\w-]+\s+[\w-]+$/m, // Properties without colons and braces

      // Stylus-specific parent reference
      /^&:[\w-]+\s+[\w-]+$/m,

      // Stylus-specific parent reference with index
      /\^[0-9]+\s*\{/,

      // Stylus-specific array indices
      /@[\w-]+\[[0-9]+\]/,
    ],
  },
  {
    name: 'uniqueOperators' as const,
    score: 0.3,
    stylesheets: [
      // Stylus-unique operators
      /[\w-]+\s*\?=\s*[^;{]+/, // Conditional assignment
      /is\s+a\s+['"](?:unit|color|string|ident|boolean)["']/, // Type checking

      // Stylus-specific property lookup
      /\@[\w-]+\[[\w\d]+\]/,

      // Stylus-only iteration
      /for\s+[\w-]+\s+in\s+\(1\.\.\d+\)/,
    ],
  },
  {
    name: 'stylusComments' as const,
    score: 0.2,
    stylesheets: [
      // Stylus-specific single-line comments that survive compilation
      /\/\/\s*@stylus/,

      // Stylus source markers
      /\/\*\s*@stylus-compiled\s*\*\//,
      /\/\*\s*@stylus-generated\s*\*\//,
    ],
  },
  {
    name: 'stylusFunctions' as const,
    score: 0.2,
    stylesheets: [
      // Stylus-specific built-in functions
      /\b(?:push|unshift|lookup|define|operate)\s*\([^)]*\)/,

      // Stylus-unique color functions
      /\b(?:lightness|desaturate|invert)\s*\([^)]*\)\s*\+\s*\d+%/,

      // Stylus-specific unit handling
      /unit\s*\([^)]+,\s*(['"])?[a-z%]+\1\s*\)/,
    ],
  },
];
