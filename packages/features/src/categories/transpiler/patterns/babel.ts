export const babel = [
  {
    name: 'coreHelpers' as const,
    score: 0.3,
    scripts: [
      // Babel's core helper functions
      /function\s+_typeof\s*\(\w+\)\s*\{(?:[^{}]|\{[^{}]*\})*typeof\s+Symbol[^}]+\}/,
      /function\s+_classCallCheck\s*\(\w+\s*,\s*\w+\)\s*\{/,
      /function\s+_defineProperties\s*\(\w+\s*,\s*\w+\)\s*\{/,
      /function\s+_createClass\s*\(\w+\s*,\s*\w+(?:\s*,\s*\w+)?\)\s*\{/,
      /function\s+_inherits\s*\(\w+\s*,\s*\w+\)\s*\{[^}]*_setPrototypeOf\s*\([^}]+\}/,

      // Runtime helpers reference pattern
      /@babel\/runtime\/helpers\//,

      // Babel's injected helpers
      /function\s+_extends\(\)\s*\{\s*_extends\s*=\s*Object\.assign\s*\|\|/,
      /function\s+_objectSpread\s*\(\w+\)\s*\{/,
    ],
  },
  {
    name: 'syntaxTransforms' as const,
    score: 0.6,
    scripts: [
      // Class transformation patterns
      /var\s+\w+\s*=\s*function\s*\(\)\s*\{\s*function\s+\w+\([^)]*\)\s*\{[^}]*_classCallCheck\(this,\s*\w+\)/,

      // Generator
      /function\s*[a-zA-Z$_][a-zA-Z$_0-9]*\s*\(\)\s*{\s*[a-zA-Z$_][a-zA-Z$_0-9]*\s*=\s*function\s*\(\)\s*{\s*return\s*[a-zA-Z$_][a-zA-Z$_0-9]*\s*}\s*;/,

      // Decorator transforms (babel specific)
      /_decorate\(\[\s*\w+(?:\s*,\s*\w+)*\s*\],\s*\w+\.prototype,\s*["'][^"']+["']/,

      // Invoke
      /[a-zA-Z$_][a-zA-Z$_0-9]*\._invoke\s*=\s*{\s*value\s*:\s*function\s*\([a-zA-Z$_][a-zA-Z$_0-9]*,\s*[a-zA-Z$_][a-zA-Z$_0-9]*\)/,

      // Wrap
      /[a-zA-Z$_][a-zA-Z$_0-9]*\(\)\s*\.\s*mark\s*\(\s*function\s*[a-zA-Z$_][a-zA-Z$_0-9]*\s*\(.*?\)\s*{\s*return\s*[a-zA-Z$_][a-zA-Z$_0-9]*\(\)\s*\.\s*wrap/,

      // Async transforms
      /function\s+_asyncToGenerator\s*\(\s*fn\s*\)\s*\{/,
      /regeneratorRuntime\.mark\(function\s+_callee\(/,
      /function\s*[a-zA-Z$_][a-zA-Z$_0-9]*\s*\([a-zA-Z$_][a-zA-Z$_0-9]*,\s*[a-zA-Z$_][a-zA-Z$_0-9]*,\s*[a-zA-Z$_][a-zA-Z$_0-9]*,\s*[a-zA-Z$_][a-zA-Z$_0-9]*,\s*[a-zA-Z$_][a-zA-Z$_0-9]*,\s*[a-zA-Z$_][a-zA-Z$_0-9]*,\s*[a-zA-Z$_][a-zA-Z$_0-9]*\)\s*{\s*try\s*{\s*var\s*[a-zA-Z$_][a-zA-Z$_0-9]*\s*=\s*[a-zA-Z$_][a-zA-Z$_0-9]*\[[a-zA-Z$_][a-zA-Z$_0-9]*\]\([a-zA-Z$_][a-zA-Z$_0-9]*\)/,

      // Symbol iterator transform
      /\[\s*[a-zA-Z$_][a-zA-Z$_0-9]*\s*\|\|\s*"@@iterator"\s*\]/,

      // Object spread/rest transforms
      /function\s+_objectWithoutProperties\s*\([^)]+\)\s*\{/,
      /function\s+_objectWithoutPropertiesLoose\s*\([^)]+\)\s*\{/,
    ],
  },
  {
    name: 'modernFeatures' as const,
    score: 0.25,
    scripts: [
      // Optional chaining transform (babel specific)
      /var\s+\w+\s*=\s*\w+\s*==\s*null\s*\?\s*void\s*0\s*:\s*\w+(?:\[|\.)(?:[^;]|;(?=[^;]))*;/,

      // Nullish coalescing transform
      /var\s+\w+\s*=\s*\w+\s*===?\s*null\s*\|\|\s*\w+\s*===?\s*void\s*0\s*\?\s*\w+\s*:\s*\w+/,

      // Private fields transform (WeakMap based)
      /var\s+\w+\s*=\s*new\s+WeakMap\(\);\s*var\s+\w+\s*=\s*function\s*\w+\s*\(/,

      // Class properties transform
      /Object\.defineProperty\(\w+\.prototype,\s*["'][^"']+["'],\s*\{\s*configurable:\s*true,\s*writable:\s*true,\s*value:/,
    ],
  },
  {
    name: 'importExport' as const,
    score: 0.2,
    scripts: [
      // Import transforms
      /Object\.defineProperty\(exports,\s*["']__esModule["'],\s*\{\s*value:\s*true\s*\}\)/,
      /exports\.(?:default|[\w$]+)\s*=\s*void\s*0/,

      // Export transforms
      /exports\[["']default["']\]\s*=\s*\w+/,

      // Dynamic import transform
      /Promise\.resolve\(\)\.\s*then\(function\s*\(\)\s*\{\s*return\s*require\(/,
    ],
  },
  {
    name: 'react-compiler' as const,
    // No score added since we are focusing to just detect the presence of React Compiler
    score: 0,
    scripts: [
      // React Compiler transformation markers
      /__COMPILER__/,
      /__RC__/,

      // Compiled component patterns
      /\$RC\.createComponent\(/,
      /\$RC\.memo\(/,
      /\$RC\.useState\(/,
      /\$RC\.useEffect\(/,

      // Optimization hints
      /\{"_generated":/,
      /\{"_optimized":/,
      /\{"_compiled":/,

      // Internal compiler markers
      /reactCompiler/,
      /babel-plugin-react-compiler/,
      /__REACT_COMPILER_POLYFILL__/,
    ],
  },
];
