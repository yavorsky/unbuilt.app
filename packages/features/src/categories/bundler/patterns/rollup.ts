export const rollup = [
  {
    name: 'core' as const,
    score: 1,
    runtime: [
      // Rollup's unique module factory pattern
      /var\s*\w+\s*=\s*\(function\s*\(exports\)\s*\{\s*['"]use strict['"]\s*;\s*\/\*\s*Rollup\s*[^*]*\*\//i,

      // Rollup's specific module system initializer
      /createCommonjsModule\s*\(\s*function\s*\(module,\s*exports\)\s*\{\s*\/\*\s*@rollup\/\w+\s*\*\//,

      // Rollup's unique plugin comment format
      /\/\*\s*rollup-plugin-\w+\s*version:\s*['"][0-9.]+['"]\s*\*\//,

      // Rollup's specific define property helper
      /Object\.defineProperty\s*\(\s*exports,\s*['"]__esModule['"],\s*\{\s*value:\s*true\s*\}\s*\);\s*\/\*\s*Rollup\s*/,
    ],
  },
  {
    name: 'chunkLoading' as const,
    score: 1,
    runtime: [
      // Rollup's unique chunk loading implementation
      /function\s*loadBundle\s*\(\s*bundle\s*\)\s*\{\s*return\s*Promise\.all\(Object\.keys\(bundle\)\.map\(\(\s*key\s*\)\s*=>\s*\{/,

      // Rollup's specific chunk registration pattern
      /function\s*register\s*\(\s*modules\s*\)\s*\{\s*modules\.forEach\(\s*function\s*\(\s*module\s*\)\s*\{\s*registry\[module\.id\]\s*=\s*module/,

      // Rollup's unique module instantiation
      /function\s*instantiate\s*\(\s*id\s*\)\s*\{\s*var\s*module\s*=\s*registry\[id\];\s*if\s*\(module\.instance\)\s*return\s*module\.instance;/,
    ],
  },
  {
    name: 'dynamicImports' as const,
    score: 1,
    runtime: [
      // Rollup's unique dynamic import implementation
      /function\s*_interopNamespace\s*\(\s*e\s*\)\s*\{\s*if\s*\(e\s*&&\s*e\.__esModule\)\s*return\s*e;\s*var\s*n\s*=\s*Object\.create\s*\(null\);\s*if\s*\(e\)\s*\{\s*Object\.keys\s*\(e\)\.forEach\s*\(/,

      // Rollup's specific dynamic import error handling
      /return\s*Promise\.resolve\s*\(\s*\)\s*\.then\s*\(\s*function\s*\(\s*\)\s*\{\s*return\s*__module__\s*\}\s*\)\.catch\s*\(\s*function\s*\(e\)\s*\{\s*deleted\[id\]\s*=\s*true;/,

      // Rollup's unique module loading pattern
      /var\s*registry\s*=\s*\{\};\s*var\s*deleted\s*=\s*\{\};\s*function\s*register\s*\(\s*id,\s*exports\s*\)\s*\{\s*deleted\[id\]\s*=\s*false;/,
    ],
  },
];
