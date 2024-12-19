export const babel = [
  {
    name: 'core' as const,
    score: 1,
    runtime: [
      // Babel's unique runtime namespace
      /babelHelpers\.[a-zA-Z]+/,

      // Babel-specific module type markers with version comment
      /@babel\/runtime\/helpers\//,

      // Babel's unique typeof helper implementation
      /_typeof\s*=\s*function\s*\(obj\)\s*\{\s*return\s*typeof\s*obj\s*;?\s*\}/,

      // Babel's unique createSuper implementation
      /_createSuper\s*=\s*function\s*\(Derived\)\s*\{\s*var\s*hasNativeReflectConstruct/,
    ],
  },
  {
    name: 'helpers' as const,
    score: 1,
    runtime: [
      // Babel's unique class helper implementations
      /function\s*_classCallCheck\s*\(instance,\s*Constructor\)\s*\{\s*if\s*\(!\(instance\s+instanceof\s+Constructor\)\)/,

      // Babel's specific async helper pattern
      /function\s*_asyncToGenerator\s*\(fn\)\s*\{\s*return\s*function\s*\(\)\s*\{\s*var\s*self\s*=\s*this,\s*args\s*=\s*arguments;?\s*return\s*new\s*Promise/,

      // Babel's unique extends helper
      /function\s*_inherits\s*\(subClass,\s*superClass\)\s*\{\s*if\s*\(typeof\s*superClass\s*!==\s*"function"\s*&&\s*superClass\s*!==\s*null\)/,

      // Babel's unique decorator implementation
      /_initializerDefineProperty\s*\(target,\s*property,\s*descriptor,\s*context\)/,
    ],
  },
  {
    name: 'moduleSystem' as const,
    score: 1,
    runtime: [
      // Babel's specific module interop helpers
      /function\s*_interopRequireDefault\s*\(obj\)\s*\{\s*return\s*obj\s*&&\s*obj\.__esModule\s*\?\s*obj\s*:\s*\{\s*"default":\s*obj\s*\}\s*\}/,

      // Babel's unique wildcard interop helper
      /function\s*_getRequireWildcardCache\s*\(nodeInterop\)\s*\{\s*if\s*\(typeof\s*WeakMap\s*!==\s*"function"\)\s*return\s*null/,

      // Babel's specific object spread implementation
      /function\s*_objectSpread2\s*\(target\)\s*\{\s*for\s*\(var\s*i\s*=\s*1;\s*i\s*<\s*arguments\.length;\s*i\+\+\)/,
    ],
  },
  {
    name: 'react-compiler' as const,
    // No score added since we are focusing to just detect the presence of React Compiler
    score: 0,
    runtime: [
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
