export const prepack = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Prepack-specific function evaluation
      /__prepack_require__/,
      /__evaluatePureFunction/,
      /\(0,[0-9]+\)/, // Function calls pattern

      // Prepack's constant folding patterns
      /Object\.freeze\(\{/,
      /Object\.defineProperties?\(/,
      /\[\],\{\}\)/,

      // Prepack's unique dead code elimination
      /void [0-9]+/,
      /void\s+function/,

      // Variable naming patterns
      /_\$[0-9]+/, // Underscore dollar number pattern
      /\$[A-Z][0-9]+/, // Dollar capital number pattern

      // Known value substitution
      /\{"value":\s*[^}]+\}/,
      /Math\.[A-Z]+/,

      // Loop unrolling patterns
      /\[\.\.\.Array\([0-9]+\)\]/,
      /Array\.from\({length:/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    filenames: [/\.prepack\.js$/, /prepack-min\.js$/, /-prepack\.js$/],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [/\.min\.js$/, /\.[a-f0-9]{8}\.js$/, /optimized\.js$/],
  },
];
