export const babel = [{
  name: 'compilation' as const,
  score: 0.2,
  runtime: [
    // Babel-specific runtime
    /@babel\/runtime/,
    /babelHelpers\./,
    /babel-runtime/,
    /__esModule.*babel/i,

    // Babel-unique helper naming patterns
    /_regenerator/,
    /_asyncGenerator/,
    /regeneratorRuntime/,
    /asyncGeneratorStep/,

    // Babel-unique class transformation
    /_createClass/,
    /_classCallCheck/,
    /_possibleConstructorReturn/,
    /_createSuper/,
    /_isNativeReflectConstruct/,

    // Babel-specific decorator implementation
    /_initializerDefineProperty/,
    /_applyDecoratedDescriptor/,
    /_descriptors/,

    // Babel-specific plugin markers
    /_interopRequireDefault/,
    /_interopRequireWildcard/,
    /_typeof2/,
    /_objectSpread2/,

    // Babel-unique minified patterns
    /\$\$typeof.*babel/i,
    /__proto__.*babel/i,
    /\[Symbol\.iterator\].*babel/i,

    // Babel transform comments
    /\/\*#__PURE__\*\//,
    /\/\*@__PURE__\*\//,
  ]
}];
