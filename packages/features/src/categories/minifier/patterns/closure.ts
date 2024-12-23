export const closure = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Closure's specific module system
      // More specific module patterns with context
      /goog\.module\(\s*(?:'[^']+'|"[^"]+")\s*\)(?:\.declareNamespace\([^)]+\))?/,
      /goog\.provide\(\s*(?:'[^']+'|"[^"]+")\s*\)(?:\.addDependency\([^)]+\))?/,
      /goog\.require\(\s*(?:'[^']+'|"[^"]+")\s*\)(?:\.requireType\([^)]+\))?/,

      // Closure's specific type system and checks
      // More specific type-related patterns
      /goog\.define\(\s*(?:'[^']+'|"[^"]+")\s*,\s*(?:[^,)]+)\s*\)/,
      /JSCompiler_(?:inline|unstripable|preserved)Function\(\s*(?:'[^']+'|"[^"]+")\s*,\s*function/,
      /\/\*\*\s*@(?:const|type|param|return|constructor|implements|interface|extends)\s+\{[^}]+\}\s*\*\//,

      // Closure's specific variable mangling with context
      // More specific naming patterns
      /var\s+(?:[a-h]\s*=\s*[^,;]+(?:\s*,\s*[a-h]\s*=\s*[^,;]+)*)/,
      /(?:let|const)\s+[A-Za-z$_][0-9]+\s*=\s*(?:function|class|new)/,
      /\$\$\d+\s*=\s*\{\s*[\w$]+:\s*(?:function|null|void|0)\s*\}/,

      // Closure's specific property access patterns
      // More specific property patterns
      /\[\s*'[$_a-zA-Z][$\w]*(?:_[0-9]+)?'\s*\]\s*(?:=|in|instanceof)/,
      /\.\$[$\w]+(?:_[0-9]+)?\s*(?=\(|\s*=\s*function)/,

      // Closure's specific optimization patterns
      // More specific function patterns
      /function\s*\(\$(?:_\d+)?(?:\s*,\s*\$(?:_\d+)?){0,3}\)\s*\{\s*['"]\$?strict['"]\s*;?/,
      /\.call\(\s*(?:this\s*\|\|\s*goog\.global|void 0|null)\s*\)/,

      // Closure's specific constant handling
      /goog\.STRICT_MODE_COMPATIBLE\s*=\s*(?:true|false)/,
      /goog\.DISALLOW_TEST_ONLY_CODE\s*=\s*(?:true|false)/,

      // Closure's specific error handling
      /goog\.asserts\.assert\(\s*[^,)]+(?:\s*,\s*(?:'[^']+'|"[^"]+"))?\s*\)/,
      /goog\.DEBUG\s*&&\s*(?:console|goog\.log)/,

      // Closure's specific template handling
      /goog\.soy\.renderAsFragment\(/,
      /soy\.renderElement\(/,

      // Closure's specific dependency injection
      /goog\.addSingletonGetter\(\s*[\w$.]+\s*\)/,
      /goog\.instantiate\(\s*[\w$.]+\s*\)/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    // More specific Closure-related filenames
    filenames: [
      /(?:^|\/)(?:[^.]+\.)?closure(?:\.min)?\.js$/,
      /(?:^|\/)(?:[^.]+\.)?closure-\d+\.\d+\.\d+\.js$/, // Version-specific
      /\.closure\.(?:advanced|simple)\.js$/, // Optimization level specific
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.1,
    // More specific compilation patterns
    filenames: [
      /\.compiled\.[a-f0-9]{8}\.js$/,
      /\.[a-f0-9]{8}\.compiled\.js$/,
      /(?:^|\/)[^.]+?-compiled-[a-f0-9]{8}\.js$/,
    ],
  },
];
