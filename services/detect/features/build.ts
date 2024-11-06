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

  private async detectBundler(): Promise<{ name: string; confidence: number }> {
    // Global markers check for all bundlers
    const globalMarkers = await this.page!.evaluate(() => {
      const allVars = Object.keys(window);
      return {
        // Vite markers
        viteEnvVars: allVars.filter(key => key.startsWith('VITE_')),
        viteMarkers: [
          '__vite__mapDeps',
          '__vite__base',
          '__vite__import',
        ].some(marker => window[marker as keyof Window] !== undefined),

        // Webpack markers
        webpackMarkers: [
          'webpackChunk',
          'webpackJsonp',
          '__webpack_require__',
          '__webpack_modules__',
          'webpack',
        ].some(marker => window[marker as keyof Window] !== undefined),

        // Rollup markers
        rollupMarkers: [
          '__rollup__',
          '__ROLLUP_LOADED_MODULES__',
        ].some(marker => window[marker as keyof Window] !== undefined),

        // Parcel markers
        parcelMarkers: [
          'parcelRequire',
          '__parcel__import__',
          'parcelModule',
        ].some(marker => window[marker as keyof Window] !== undefined),
      };
    });

    const patterns = {
      webpack: {
        // Core Webpack patterns
        runtime: [
          /__webpack_require__/,
          /webpack\/runtime/,
          /webpack\/bootstrap/,
          /webpack-dev-server/,
          /webpack\/hot\/dev-server/,
          /webpack-hot-middleware/,
          /__webpack_exports__/,
          /__webpack_module__/,
          /webpackChunk/,
          /webpackJsonp/,
          /webpack_require\.e/,  // Chunk loading
          /webpack_require\.t/,  // Module mode
          /webpack_require\.d/,  // Exports definition
          /webpack_require\.o/,  // Object.prototype.hasOwnProperty
          /webpack_require\.r/,  // Module.__esModule
        ],
        // Asset patterns
        assets: [
          /\.[a-f0-9]{20}\.js$/,  // Content hash
          /\.(js|css)\.[a-f0-9]{8}\.hot-update\./,  // HMR
          /chunks?\/[a-zA-Z0-9]+\.[a-f0-9]+\.js/,   // Chunk naming
          /runtime~[a-zA-Z0-9]+\.[a-f0-9]+\.js/,    // Runtime chunks
          /vendors~[a-zA-Z0-9]+\.[a-f0-9]+\.js/,    // Vendor chunks
        ],
        // Build output patterns
        build: [
          /\(\{\}\["webpackJsonp"\]\s*=\s*\{\}\["webpackJsonp"\]\s*\|\|\s*\[\]\)/,
          /function\([a-zA-Z0-9_$]+,\s*[a-zA-Z0-9_$]+,\s*[a-zA-Z0-9_$]+\)\s*{\s*return\s*__webpack_require__/,
          /window\["webpackJsonp"\]/,
          /window\.webpackJsonp/,
        ],
        // Module handling patterns
        modules: [
          /modules\[\[[^\]]+\]\]/,  // Module arrays
          /defineProperty\(exports,\s*"__esModule"/,
          /Object\.defineProperty\(exports,\s*"__esModule"/,
          /typeof\s+Symbol\s*!==\s*"undefined"\s*&&\s*Symbol\.toStringTag/,
        ]
      },

      rollup: {
        // Core Rollup patterns
        runtime: [
          /\brollup\b/,
          /__ROLLUP_LOADED_MODULES__/,
          /define\(['"]rollup/,
          /export\s+default\s+[a-zA-Z0-9_$]+;/,
          /Object\.defineProperty\(exports,\s*['"]__esModule['"]/,
          /exports\s*\.\s*[a-zA-Z0-9_$]+\s*=\s*void\s*0/,
        ],
        // Asset patterns
        assets: [
          /\-[a-f0-9]{8}\.js$/,  // Hash suffix
          /assets\/[a-zA-Z0-9]+\-[a-f0-9]{8}\.js/,  // Asset naming
          /chunk\-[a-zA-Z0-9]+\-[a-f0-9]{8}\.js/,   // Chunk naming
          /bundle\.[a-f0-9]{8}\.js/,                 // Bundle naming
        ],
        // Build output patterns
        build: [
          /\(function\s*\(['"](exports|module)['"]\)\s*{/,
          /\(this\.?[a-zA-Z0-9_$]*\s*\|\|\s*{}\);/,
          /export\s*{\s*[a-zA-Z0-9_$]+\s+as\s+default\s*}/,
          /export\s*default\s+[a-zA-Z0-9_$]+;/,
        ],
        // Module handling patterns
        modules: [
          /import\s*\.\s*meta\s*\.\s*url/,
          /import\.meta\.hot/,
          /export\s*{\s*[^}]+\s*}/,
          /import\s*{\s*[^}]+\s*}\s*from/,
        ]
      },

      vite: {
        // Core Vite patterns that survive minification
        runtime: [
          /__vite__mapDeps/,
          /__vite__legacy/,
          /__vite_legacy_guard/,
          /__vite__modulepreload/,
          /__vite__base/,
          /__vite__import/,
          /__vite__injectQuery/,
          /VITE_[A-Z_]+/,  // Environment variables
          /import\.meta\.env\.VITE_/,
          /import\.meta\.hot/,
          /\?v=[a-zA-Z0-9]+/,  // Vite's query string pattern
        ],
        // Asset patterns
        assets: [
          /\/assets\/[^"']+\.[a-z0-9]+\.js/, // Vite asset pattern
          /\.(js|css)\?t=\d+/, // Vite's timestamp query
          /\?used/, // Vite's used query parameter
          /\?raw/,  // Vite's raw imports
          /\?url/   // Vite's url imports
        ],
        // Build output patterns
        build: [
          /const\s+[a-zA-Z0-9_$]+\s*=\s*"[a-z0-9]+";?\s*\/\/\s*vite/i,
          /assets\/index\.[a-z0-9]+\.js/,
          /assets\/vendor\.[a-z0-9]+\.js/
        ],
        // Module handling patterns
        modules: [
          /import\.meta\.glob/,
          /import\.meta\.url/,
          /__vitePreload/,
          /\?worker(_thread)?=/
        ]
      },

      parcel: {
        // Core Parcel patterns
        runtime: [
          /parcelRequire/,
          /parcelModule/,
          /__parcel__import__/,
          /\$[a-f0-9]{16}\$exports/,  // Parcel's unique export pattern
          /parcel_sourcemap_/,
          /parcelRegister/,
        ],
        // Asset patterns
        assets: [
          /\.[a-f0-9]{8}\.js$/,  // Content hash
          /\.[a-f0-9]{8}\.hot-update\./,  // HMR
          /\/[a-f0-9]{16}\.js/,  // Module ID
          /\.parcel-cache/,
        ],
        // Build output patterns
        build: [
          /module\.bundle\.Module/,
          /module\.exports\s*=\s*\$[a-f0-9]{16}\$/,
          /parcelRequire\s*=\s*\(function\s*\([^)]*\)\s*{/,
          /function\s*\$[a-f0-9]{16}\$init\s*\(/,
        ],
        // Module handling patterns
        modules: [
          /\$[a-f0-9]{16}\$exports/,
          /\$[a-f0-9]{16}\$init/,
          /parcelRequire\.register/,
          /module\.hot\.accept/,
        ]
      },

      esbuild: {
        // Core esbuild patterns
        runtime: [
          /__toESM/,
          /__toCommonJS/,
          /__require/,
          /__commonJS/,
          /esbuild\-bundle/,
        ],
        // Asset patterns
        assets: [
          /\.[a-z0-9]{8}\.js$/,
          /\/chunk\-[a-z0-9]+\.js/,
          /\-[A-Z0-9]{8}\.js/,
        ],
        // Build output patterns
        build: [
          /var\s+[a-zA-Z0-9_$]+\s*=\s*{}\s*;\s*export\s*{/,
          /\(\(\)\s*=>\s*{\s*var\s+[a-zA-Z0-9_$]+\s*=\s*{}/,
          /export\s*default\s*{}/,
        ],
        // Module handling patterns
        modules: [
          /import\s*\.\s*meta\s*\.\s*url/,
          /require\s*\.\s*resolve/,
          /Promise\.resolve\(\)\.then\(\(\)\s*=>\s*import\(/,
        ]
      }
    };

    const scores = {
      webpack: 0,
      rollup: 0,
      vite: 0,
      parcel: 0,
      esbuild: 0
    };

    // Check global markers
    if (globalMarkers.webpackMarkers) scores.webpack += 0.4;
    if (globalMarkers.rollupMarkers) scores.rollup += 0.4;
    if (globalMarkers.viteMarkers || globalMarkers.viteEnvVars.length > 0) scores.vite += 0.4;
    if (globalMarkers.parcelMarkers) scores.parcel += 0.4;

    // Helper function to check patterns
    const checkPatterns = <T extends keyof typeof patterns>(
      content: string,
      bundler: T,
      category: keyof typeof patterns[T],
      weight: number
    ) => {
      const bundlerPatternsList = patterns[bundler][category] as RegExp[];

      bundlerPatternsList.forEach((pattern: RegExp) => {
        if (pattern.test(content)) {
          scores[bundler] += weight;
        }
      });
    };

    // Get all scripts and resources content
    const allScripts = Array.from(this.resources.getAllScripts()).join('\n');
    const resourceUrls = Array.from(this.resources.getAll())
      .map(r => r.url || '')
      .join('\n');

    // Check patterns for each bundler
    Object.keys(patterns).forEach(bundler => {
      const bundlerKey = bundler as keyof typeof patterns;
      // Runtime patterns are strong indicators
      checkPatterns(allScripts, bundlerKey, 'runtime', 0.25);
      // Asset patterns are good indicators
      checkPatterns(resourceUrls, bundlerKey, 'assets', 0.15);
      // Build patterns are strong indicators
      checkPatterns(allScripts, bundlerKey, 'build', 0.2);
      // Module patterns are moderate indicators
      checkPatterns(allScripts, bundlerKey, 'modules', 0.1);
    });

    // Normalize scores
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.min(scores[key as keyof typeof scores], 1);
    });

    // Find the highest scoring bundler
    const [[detectedBundler, maxScore]] = Object.entries(scores)
      .sort(([, a], [, b]) => b - a);

    return {
      name: maxScore > 0.3 ? detectedBundler : 'unknown',
      confidence: maxScore
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