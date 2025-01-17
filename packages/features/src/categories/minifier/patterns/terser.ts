export const terser = [
  {
    name: 'compilation' as const,
    score: 0.2,
    scripts: [
      // Primary Terser identifier - module wrapper pattern
      // Example: (()=>{"use strict";var e={};...)()
      /^\(\(\)\s*=>\s*\{"use strict";(?:var|let|const)\s+[a-zA-Z$_]\s*=\s*\{/,

      // Terser's optimization for void 0 vs undefined
      // Example: return void 0
      /(?:return|[=!]=)\s*void\s*0\b/,

      // Terser's function parameter optimization
      // Example: (e,...t)=> or function(e,...t){
      /(?:\(|function\s*)[a-zA-Z$_][a-zA-Z0-9$_]*,\s*\.\.\.[$_a-z]\)\s*[={]/,

      // Terser's object property shorthand optimization
      // Example: {foo:foo} -> {foo}
      /,([a-zA-Z$_][a-zA-Z0-9$_]*)\s*:\s*\1(?=\}|,)/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    filenames: [/\.terser\.(?:min\.)?js$/, /\.min\.[a-f0-9]{8}\.terser\.js$/],
  },
];
