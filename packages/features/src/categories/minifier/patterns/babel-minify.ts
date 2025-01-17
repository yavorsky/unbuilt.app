export const babelMinify = [
  {
    name: 'compilation' as const,
    score: 0.5,
    scripts: [
      // Babel minification specific patterns
      // Only includes patterns unique to Babel's minification

      // Babel Minify's specific sequence expression optimization
      // Example: (a=1,b=2,a+b)
      /\([$_a-z]=\d+,[$_a-z]=\d+,[$_a-z][+\-*/][$_a-z]\)/,

      // Babel Minify's unique numeric literal optimization
      // Example: | 0 for integer conversion
      /\|\s*0(?!\d)/,

      // Babel Minify's specific dead code elimination pattern
      // Example: "production"==="production"&&
      /["']production["']===["']production["']\&\&/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    filenames: [/\.babel\.min\.js$/, /\.min\.babel\.js$/],
  },
];
