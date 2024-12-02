// Google Closure Compiler patterns - focuses on unique aspects of GCC
export const closure = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Closure-specific variable & property mangling
      /\b[a-h]\b(?=\.[a-h]|\[)/, // Single letter a-h pattern
      /[A-Za-z$_][0-9]+(?=[\.\[])/, // letter followed by numbers
      /\$\$\d+/, // Double dollar with numbers

      // Module/exports pattern
      /module\$exports/,
      /exports\$\w+/,
      /goog\.define/,

      // Closure's unique type checking
      /goog\./,
      /JSCompiler_/,
      /\@const\b/,

      // Advanced optimization patterns
      /function\((\$\$?,){0,3}\$\$?\)\{/, // Parameter naming
      /\.call\(this\|\|goog\.global\)/,

      // Unique property renaming
      /\['[\$_a-zA-Z][\$\w]*'\]/,
      /\.\$\w+\b/,

      // Closure-specific inlining patterns
      /INLINE_RUNTIME/,
      /COMPILED/,

      // Closure Library remnants
      /goog\.require/,
      /goog\.provide/,
      /goog\.module/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    filenames: [/\.closure\.js$/, /closure-compiled\.js$/, /\-closure\.js$/],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [/\.min\.js$/, /\.[a-f0-9]{8}\.js$/, /compiled\.js$/],
  },
];
