export const uglify = [
  {
    name: 'compilation' as const,
    score: 0.5,
    scripts: [
      // Primary UglifyJS identifier - variable naming and IIFE pattern
      // Example: !function(e,t){...}(window)
      /^!function\([a-z],\s*[a-z]\)\{.{0,50}?\}\((?:window|this)\)/,

      // UglifyJS's unique variable compression
      // Prefers single letters a-z for variables and function params
      // Example: function a(b,c){return b+c}
      /function [a-z]\([a-z],\s*[a-z]\)\{return [a-z][+\-*/][a-z]\}/,

      // UglifyJS boolean optimizations
      // Example: foo===!0, bar!==!1
      /(?:[=!]=)!(?:0|1)(?!\d)/,

      // UglifyJS's sequence expressions with comma operator
      // Example: (e=t.length,n=e-1,e)
      /\((?:[a-z]=(?:[a-z]\.(?:length|id|name)),?){2,}\s*[a-z]\)/,

      // UglifyJS property access pattern with string concatenation
      // Example: o["get"+t]
      /\[["'](?:[gs]et|on|handle)[^"']+["']\+[a-z]\]/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    filenames: [
      /\.uglify(?:js)?\.(?:min\.)?js$/,
      /\.min\.[a-f0-9]{8}\.ugly\.js$/,
    ],
  },
];
