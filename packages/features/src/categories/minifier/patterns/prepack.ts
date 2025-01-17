export const prepack = [
  {
    name: 'compilation' as const,
    score: 0.2,
    scripts: [
      // Prepack's constant folding and evaluation
      // Example: Math.pow(2, 3) -> 8
      // Look for clusters of numeric literals that would normally be expressions
      /(?:\b\d+(?:\.\d+)?\b[+\-*/]){3,}\b\d+(?:\.\d+)?\b/,

      // Prepack's dead code elimination
      // Example: if (false) { ... } -> [removed]
      // Look for simplified conditionals that would be more complex in source
      /if\(!0\)\{(?:[^{}]|{[^{}]*})*\}/,

      // Prepack's string concatenation optimization
      // Example: "a" + "b" + "c" -> "abc"
      // Look for long string literals that would likely be concatenated in source
      /["'][a-zA-Z0-9_$]{10,}["']/,

      // Prepack's loop unrolling
      // Example: for(var i=0;i<3;i++){x+=i} -> x=0;x=1;x=2;
      // Look for repeated similar statements that would likely be loops
      /(?:[$_a-z]+=\d+;){3,}/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    filenames: [
      /\.prepack\.min\.js$/,
      /\.pp\.min\.js$/,
      /\.[a-f0-9]{8}\.prepack\.js$/,
    ],
  },
];
