export interface BuildFeatures {
  codeModularity: {
    hasCodeSplitting: boolean;
    hasDynamicImports: boolean;
    hasTreeShaking: boolean;
    hasModuleSystem: 'esm' | 'commonjs' | 'amd' | 'umd' | 'none';
  };
  optimization: {
    hasSourceMaps: boolean;
    hasMinification: boolean;
    hasPrefetching: boolean;
    hasPreloading: boolean;
  };
  modern: {
    usesModernSyntax: boolean;
    usesAsyncAwait: boolean;
    usesOptionalChaining: boolean;
    useNullishCoalescing: boolean;
  };
  performance: {
    hasCaching: boolean;
    hasLazyLoading: boolean;
    hasWorkers: boolean;
  };
}