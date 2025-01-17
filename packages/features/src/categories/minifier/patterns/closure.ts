export const closure = [
  {
    name: 'compilation' as const,
    score: 0.2,
    scripts: [
      // Closure's aggressive variable renaming with underscore suffix
      // Example: var a_=function(b_,c_){return b_+c_}
      /var [$_a-z]_=function\([$_a-z]_,[$_a-z]_\)\{return [$_a-z]_[+\-*/][$_a-z]_\}/,

      // Closure's unique property dot access optimizations
      // Example: this.a_=1,this.b_=2
      /this\.[$_a-z]_=\d+(?:,this\.[$_a-z]_=\d+){1,}/,

      // Closure's specific typeof undefined check
      // Example: "undefined"==typeof window
      /["']undefined["']==typeof [$_a-z]\b/,

      // Closure's unique boolean optimization pattern
      // Example: !0 === true, !1 === false with specific formatting
      /[=!]=(?:=)?!(?:0|1)(?!\d)(?:&&|\|\||\}|\))/,

      // Closure's specific string optimizations in object properties
      // Example: {'a':1,'b':2} -> {a:1,b:2}
      /\{[$_a-z]:(?:\d+|!0|!1)(?:,[$_a-z]:(?:\d+|!0|!1))*\}/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    filenames: [
      /\.closure\.min\.js$/,
      /\.cc\.min\.js$/,
      /\.[a-f0-9]{8}\.closure\.js$/,
    ],
  },
];
