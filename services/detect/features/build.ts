import { Page } from 'playwright';
import { Resources } from '../resources';

export interface BuildFeatures {
  bundler: {
    name: string;
    confidence: number;
  };
  transpiler: {
    name: string;
    confidence: number;
  };
  minifier: {
    name: string;
    confidence: number;
  };
  optimization: {
    codeModularity: boolean;
    treeShaking: boolean;
    codeSplitting: boolean;
  };
}

export class BuildFeaturesDetector {
  private page: Page;
  private resources: Resources;
  constructor(page: Page, resources: Resources) {
    this.page = page;
    this.resources = resources;
  }

  async detect(): Promise<BuildFeatures> {
    return {
      bundler: await this.detectBundler(),
      transpiler: await this.detectTranspiler(),
      minifier: await this.detectMinifier(),
      optimization: await this.detectOptimizations(),
    };
  }

  private async detectBundler() {
    const patterns = {
      webpack: ['__webpack_require__', 'webpackJsonp', 'webpack/runtime', '__webpack_exports__'],
      vite: [
        '/@vite/client',
        'import.meta.hot',
        'vite/modulepreload-polyfill',
        '__vite_ssr_import__',
      ],
      rollup: ['ROLLUP_ASSET_URL', 'define:__ROLLUP_', 'rollup-plugin', '__rollup_chunk'],
      parcel: ['parcelRequire', 'parcel-bundler', 'parcel-cache', '__parcel__import__'],
      esbuild: ['esbuild-loader', '__esbuild_chunk', 'esbuild-register'],
    };

    const results = Object.entries(patterns).map(([bundler, signs]) => ({
      name: bundler,
      confidence: this.resources.calculateConfidence(signs),
    })).sort((a, b) => b.confidence - a.confidence);

    return {
      name: results[0].confidence > 0.3 ? results[0].name : 'unknown',
      confidence: results[0].confidence,
    };
  }

  private async detectTranspiler() {
    const patterns = {
      babel: [
        '_regeneratorRuntime',
        '_classCallCheck',
        '_createClass',
        '@babel/runtime',
        'babel-polyfill',
      ],
      typescript: ['__extends', '__decorate', '__metadata', 'tslib', '__importDefault'],
      swc: ['@swc/helpers', '_ts_generator', '_async_to_generator', 'swc-loader'],
    };

    const results = Object.entries(patterns).map(([transpiler, signs]) => ({
      name: transpiler,
      confidence: this.resources.calculateConfidence(signs),
    })).sort((a, b) => b.confidence - a.confidence);

    return {
      name: results[0].confidence > 0.3 ? results[0].name : 'unknown',
      confidence: results[0].confidence,
    };
  }

  private async detectMinifier() {
    // Analyze minification patterns in scripts
    const characteristics = Array.from(this.resources.getAllScripts()).map((script) => ({
      avgLineLength: script.length / (script.match(/\n/g)?.length || 1),
      hasSourceMap: script.includes('//# sourceMappingURL='),
      hasShortVars: /\b[a-z]{1,2}\b/.test(script),
      hasMinPatterns: /[;,]\w+[:=]\w+/.test(script),
    }));

    // Terser typically produces more aggressive minification
    // const terserPatterns = {
    //   shortVarNames: true,
    //   noNewlines: true,
    //   functionPatterns: /function\([a-z],[a-z],[a-z]\)/,
    // };

    // UglifyJS patterns
    // const uglifyPatterns = {
    //   wrappingPattern: /!function\(/,
    //   commaOperators: /,[a-z]=/,
    // };

    // esbuild patterns
    // const esbuildPatterns = {
    //   preservesNewlines: true,
    //   moduleWrapping: /\(()=>/,
    // };

    const scores = {
      terser: 0,
      uglify: 0,
      esbuild: 0,
    };

    characteristics.forEach((chars) => {
      // Score Terser patterns
      if (chars.avgLineLength > 500) scores.terser += 0.3;
      if (chars.hasShortVars) scores.terser += 0.3;
      if (!chars.hasSourceMap) scores.terser += 0.2;

      // Score UglifyJS patterns
      if (chars.avgLineLength > 300) scores.uglify += 0.2;
      if (chars.hasMinPatterns) scores.uglify += 0.3;

      // Score esbuild patterns
      if (chars.avgLineLength < 300) scores.esbuild += 0.2;
      if (chars.hasSourceMap) scores.esbuild += 0.2;
    });

    const [[name, confidence]] = Object.entries(scores).sort(([, a], [, b]) => b - a);

    return {
      name,
      confidence: confidence / characteristics.length,
    };
  }

  private async detectOptimizations() {
    const hasCodeSplitting = Array.from(this.resources.getAll())
      .filter((r) => r.type === 'script')
      .some((r) => r.url?.includes('chunk'));

    const hasTreeShaking = Array.from(this.resources.getAllScripts()).some(
      (script) => script.includes('/*#__PURE__*/') || script.includes('/*@__PURE__*/')
    );

    const hasDynamicImports = Array.from(this.resources.getAllScripts()).some(
      (script) => script.includes('import(') || script.includes('require.ensure')
    );

    return {
      codeModularity: hasDynamicImports,
      treeShaking: hasTreeShaking,
      codeSplitting: hasCodeSplitting,
    };
  }
};