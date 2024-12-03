export const babel = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // Core Babel runtime identifiers
      /babelHelpers\./,
      /__esModule.*babel/i,
      /\$\$typeof.*babel/i,
    ],
  },
  {
    name: 'transforms' as const,
    score: 0.9,
    runtime: [
      // Babel-specific class transformations
      /_createClass/,
      /_classCallCheck/,
      /_possibleConstructorReturn/,
      /_createSuper/,
      /_isNativeReflectConstruct/,
    ],
  },
  {
    name: 'decorators' as const,
    score: 0.8,
    runtime: [
      // Babel-unique decorator implementation
      /_initializerDefineProperty/,
      /_applyDecoratedDescriptor/,
      /_decorate\(\[/,
    ],
  },
  {
    name: 'interop' as const,
    score: 0.7,
    runtime: [
      // Babel-specific module interop
      /_interopRequireDefault/,
      /_interopRequireWildcard/,
      /_objectSpread2/,
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
      /\$RC\./,

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
