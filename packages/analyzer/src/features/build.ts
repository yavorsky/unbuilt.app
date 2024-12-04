import { Page } from 'playwright';
import { Resources } from '../resources.js';

interface MinifierResult {
  name: string;
  confidence: number;
  features?: {
    mangling: boolean;
    compression: boolean;
    deadCodeElimination: boolean;
    sourceMap: boolean;
  };
}

interface TranspilerResult {
  name: string;
  confidence: number;
  version?: string;
  features: {
    typescript: boolean;
    decorators: boolean;
    classProperties: boolean;
    asyncAwait: boolean;
    optionalChaining?: boolean;
    nullishCoalescing?: boolean;
    privateMembers?: boolean;
  };
  target?: {
    ecmaVersion: string;
  };
}

type SupportedBundler =
  | 'webpack'
  | 'rollup'
  | 'vite'
  | 'parcel'
  | 'turbopack'
  | 'esbuild'
  | 'nx'
  | 'bazel'
  | 'bun'
  | 'gulp'
  | 'grunt'
  | 'brunch';

type BuildPatterns = Record<
  SupportedBundler,
  {
    runtime: RegExp[];
    assets: RegExp[];
    build: RegExp[];
    modules: RegExp[];
  }
>;

export interface BuildFeatures {
  bundler: {
    name: string;
    confidence: number;
  };
  transpiler: TranspilerResult;
  minifier: MinifierResult;
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
        viteEnvVars: allVars.filter((key) => key.startsWith('VITE_')),
        viteMarkers: ['__vite__mapDeps', '__vite__base', '__vite__import'].some(
          (marker) => window[marker as keyof Window] !== undefined
        ),

        // Webpack markers
        webpackMarkers: [
          'webpackChunk',
          'webpackJsonp',
          '__webpack_require__',
          '__webpack_modules__',
          'webpack',
        ].some((marker) => window[marker as keyof Window] !== undefined),

        // Rollup markers
        rollupMarkers: ['__rollup__', '__ROLLUP_LOADED_MODULES__'].some(
          (marker) => window[marker as keyof Window] !== undefined
        ),

        // Parcel markers
        parcelMarkers: [
          'parcelRequire',
          '__parcel__import__',
          'parcelModule',
        ].some((marker) => window[marker as keyof Window] !== undefined),
      };
    });

    const webpackBuildPatterns = {
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
        /webpack_require\.e/, // Chunk loading
        /webpack_require\.t/, // Module mode
        /webpack_require\.d/, // Exports definition
        /webpack_require\.o/, // Object.prototype.hasOwnProperty
        /webpack_require\.r/, // Module.__esModule
      ],
      // Asset patterns
      assets: [
        /\.[a-f0-9]{20}\.js$/, // Content hash
        /\.(js|css)\.[a-f0-9]{8}\.hot-update\./, // HMR
        /chunks?\/[a-zA-Z0-9]+\.[a-f0-9]+\.js/, // Chunk naming
        /runtime~[a-zA-Z0-9]+\.[a-f0-9]+\.js/, // Runtime chunks
        /vendors~[a-zA-Z0-9]+\.[a-f0-9]+\.js/, // Vendor chunks
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
        /modules\[\[[^\]]+\]\]/, // Module arrays
        /defineProperty\(exports,\s*"__esModule"/,
        /Object\.defineProperty\(exports,\s*"__esModule"/,
        /typeof\s+Symbol\s*!==\s*"undefined"\s*&&\s*Symbol\.toStringTag/,
      ],
    };

    const patterns: BuildPatterns = {
      webpack: webpackBuildPatterns,

      // Turbopack is a mix of webpack and turbopack specific patterns
      turbopack: {
        runtime: [
          ...webpackBuildPatterns.runtime,
          /__turbopack_require__/,
          /__turbopack_external_require__/,
          /__turbopack_chunk_/,
          /__turbopack_module__/,
          /turbopack\/runtime/,
          /__turbopack_load__/,
          /TURBOPACK compile-time/,
          /__turbopack_import__/,
          /global\$turbopack/,
        ],
        assets: [
          ...webpackBuildPatterns.assets,
          /\_next\/static\/chunks\/\[turbo\]/,
          /\.entry\.js$/,
          /\.chunk\.js$/,
          /\_(app|page|layout|loading|error)\-[a-f0-9]+\.js$/,
          /turbo-client-runtime-[a-f0-9]+\.js/,
        ],
        build: [
          ...webpackBuildPatterns.build,
          /turbo\.json/,
          /.turbo\/config.json/,
        ],
        modules: [
          ...webpackBuildPatterns.modules,
          /@vercel\/turbopack-ecmascript-runtime/,
          /turbopack\.loadPage/,
          /turbopack\.register/,
          /eval\(\"require\"\)/,
        ],
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
          /\-[a-f0-9]{8}\.js$/, // Hash suffix
          /assets\/[a-zA-Z0-9]+\-[a-f0-9]{8}\.js/, // Asset naming
          /chunk\-[a-zA-Z0-9]+\-[a-f0-9]{8}\.js/, // Chunk naming
          /bundle\.[a-f0-9]{8}\.js/, // Bundle naming
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
        ],
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
          /VITE_[A-Z_]+/, // Environment variables
          /import\.meta\.env\.VITE_/,
          /import\.meta\.hot/,
          /@vite\/client/,
          /vite\/modulepreload-polyfill/,
          /vite\/preload-helper/,
          /\?v=[a-zA-Z0-9]+/, // Vite's query string pattern
        ],
        // Asset patterns
        assets: [
          /\/assets\/[^"']+\.[a-z0-9]+\.js/, // Vite asset pattern
          /\.(js|css)\?t=\d+/, // Vite's timestamp query
          /\?used/, // Vite's used query parameter
          /\?raw/, // Vite's raw imports
          /\?url/, // Vite's url imports
        ],
        // Build output patterns
        build: [
          /const\s+[a-zA-Z0-9_$]+\s*=\s*"[a-z0-9]+";?\s*\/\/\s*vite/i,
          /assets\/index\.[a-z0-9]+\.js/,
          /assets\/vendor\.[a-z0-9]+\.js/,
        ],
        // Module handling patterns
        modules: [
          /import\.meta\.glob/,
          /import\.meta\.url/,
          /__vitePreload/,
          /\?worker(_thread)?=/,
        ],
      },

      parcel: {
        // Core Parcel patterns
        runtime: [
          /parcelRequire/,
          /parcelModule/,
          /__parcel__import__/,
          /\$[a-f0-9]{16}\$exports/, // Parcel's unique export pattern
          /parcel_sourcemap_/,
          /parcelRegister/,
        ],
        // Asset patterns
        assets: [
          /\.[a-f0-9]{8}\.js$/, // Content hash
          /\.[a-f0-9]{8}\.hot-update\./, // HMR
          /\/[a-f0-9]{16}\.js/, // Module ID
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
        ],
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
        ],
      },

      nx: {
        runtime: [
          /__nx_bundle_/,
          /nx\-console/,
          /@nrwl\/workspace/,
          /nx\/init/,
          /nx\/utils/,
        ],
        assets: [
          /dist\/apps\/[^\/]+\//,
          /dist\/libs\/[^\/]+\//,
          /\.nx-cache\//,
          /nx-cloud/,
        ],
        build: [],
        modules: [
          /@nrwl\/[a-zA-Z-]+/,
          /nx g @nrwl/,
          /nx affected/,
          /nx run-many/,
        ],
      },

      bazel: {
        runtime: [
          /__bazel_script_/,
          /__bazel_bundle_/,
          /__bazel_module_/,
          /bazelbuild/,
          /rules_nodejs/,
        ],
        build: [],
        assets: [
          /bazel\-out\/[^\/]+\//,
          /bazel\-bin\/[^\/]+\//,
          /bazel\-testlogs\/[^\/]+\//,
          /\.runfiles\//,
        ],
        modules: [
          /load\("[^"]+"\)/,
          /exports_files\(\[/,
          /filegroup\(name = /,
          /js_library\(name = /,
        ],
      },

      bun: {
        runtime: [
          /Bun\.serve/,
          /Bun\.build/,
          /Bun\.plugin/,
          /bun:ffi/,
          /bun:sqlite/,
          /bun:jsc/,
        ],
        assets: [
          /bun\.lockb$/,
          /\.bun\//,
          /bun-double-[a-f0-9]+\.js/,
          /bun-[a-f0-9]+\.js/,
        ],
        build: [],
        modules: [
          /import\.meta\.require/,
          /Bun\.env\./,
          /process\.bun/,
          /bun(Import|Resolve)\(/,
        ],
      },

      // Legacy patterns. Confident detection is not accurate

      gulp: {
        runtime: [
          /require\('gulp'\)/,
          /gulp\.task\(/,
          /gulp\.src\(/,
          /gulp\.dest\(/,
          /gulp\.watch\(/,
          /gulp\.series\(/,
          /gulp\.parallel\(/,
        ],
        assets: [/\.tmp\//, /dist\//, /build\//, /\.gulp\-cache/],
        build: [],
        modules: [
          /gulp-[a-zA-Z-]+/,
          /require\('gulp-[^']+'\)/,
          /pipe\(([^)]+)\)/,
          /\.pipe\(/,
        ],
      },

      grunt: {
        runtime: [
          /require\('grunt'\)/,
          /grunt\.initConfig\(/,
          /grunt\.loadNpmTasks\(/,
          /grunt\.registerTask\(/,
          /grunt\.file\./,
        ],
        assets: [/\.grunt\//, /dist\//, /temp\//, /tmp\//],
        build: [],
        modules: [
          /grunt-contrib-[a-zA-Z-]+/,
          /grunt-[a-zA-Z-]+/,
          /require\('grunt-[^']+'\)/,
          /loadNpmTasks\('grunt-[^']+'\)/,
        ],
      },

      brunch: {
        runtime: [
          // Core Brunch runtime patterns
          /require\.register\(['"]/,
          /window\.require\.register/,
          /window\.require\.deps/,
          /window\.__brunch__/,
          /__brunch_framework__/,
          /brunch-config/,
          /brunch-reload/,
        ],
        assets: [
          // Brunch's asset patterns
          /public\/[^\/]+\-[a-f0-9]{8}\.(js|css)$/, // Fingerprinted assets
          /app\.(js|css)$/, // Main bundles
          /vendor\.(js|css)$/, // Vendor bundles
          /\.(js|css)\.map$/, // Source maps
          /public\/assets\//, // Asset directory
        ],
        build: [/\(function\(\) \{\s*window\.require\.register/],
        modules: [
          // Module handling patterns
          /require\.register\(['"]([^'"]+)['"]/,
          /require\.alias\(/,
          /window\.require\(['"]([^'"]+)/,
          /module\.exports = /,
          /exports\.\w+ = /,
          /^require\.modules = /m,
        ],
      },
    };

    const scores: Record<keyof typeof patterns, number> = {
      webpack: 0,
      turbopack: 0,
      rollup: 0,
      vite: 0,
      parcel: 0,
      esbuild: 0,
      nx: 0,
      bun: 0,
      bazel: 0,
      gulp: 0,
      grunt: 0,
      brunch: 0,
    };

    // Check global markers
    if (globalMarkers.webpackMarkers) scores.webpack += 0.4;
    if (globalMarkers.rollupMarkers) scores.rollup += 0.4;
    if (globalMarkers.viteMarkers || globalMarkers.viteEnvVars.length > 0)
      scores.vite += 0.4;
    if (globalMarkers.parcelMarkers) scores.parcel += 0.4;

    // Helper function to check patterns
    const checkPatterns = <T extends keyof typeof patterns>(
      content: string,
      bundler: T,
      category: keyof (typeof patterns)[T],
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
    const allScripts = this.resources.getAllScriptsContent();
    // fs.writeFile('/Users/ayavorskyi/Developer/unbuilt/allScripts.js', allScripts);

    const resourceUrls = Array.from(this.resources.getAll())
      .map((r) => r.url || '')
      .join('\n');

    // Check patterns for each bundler
    Object.keys(patterns).forEach((bundler) => {
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

    console.log(scores);

    // Normalize scores
    Object.keys(scores).forEach((key) => {
      scores[key as keyof typeof scores] = Math.min(
        scores[key as keyof typeof scores],
        1
      );
    });

    // Find the highest scoring bundler
    const [[detectedBundler, maxScore]] = Object.entries(scores).sort(
      ([, a], [, b]) => b - a
    );

    return {
      name: maxScore > 0.3 ? detectedBundler : 'unknown',
      confidence: maxScore,
    };
  }

  private async detectTranspiler(): Promise<TranspilerResult> {
    const patterns = {
      babel: {
        // Runtime helpers
        runtime: [
          // Core babel runtime helpers
          /_regeneratorRuntime/,
          /_classCallCheck/,
          /_createClass/,
          /_inherits/,
          /_createSuper/,
          /_slicedToArray/,
          /@babel\/runtime/,
          // Specific babel class transform patterns
          /function _(?:inherits|possibleConstructorReturn|classCallCheck)/,
          // Babel's async transform
          /regeneratorRuntime\.mark\(function/,
          // Babel's decorators implementation
          /_decorate\(\[/,
          // Babel's class properties transform
          /Object\.defineProperty\(.*?prototype.*?,.*?{/,
        ],
        // Module transformation patterns
        modules: [
          // ES Modules transform patterns
          /Object\.defineProperty\(exports,\s*["']__esModule["']/,
          /exports\.default\s*=/,
          /exports\.__esModule\s*=\s*true/,
          /require\(["'][^"']+["']\)/,
        ],
        // Modern syntax transformation
        syntax: [
          // Optional chaining transform
          /\?\.|\?\[/,
          // Nullish coalescing transform
          /\?\?/,
          // Private class members transform
          /_classPrivateField/,
        ],
        // Specific version markers
        version: [
          /"version"\s*:\s*"([^"]+)"\s*,\s*"name"\s*:\s*"@babel\/runtime"/,
          /\/\*\s*@babel\/runtime\s+([^\s*]+)\s*\*\//,
        ],
      },

      swc: {
        // SWC runtime helpers
        runtime: [
          // SWC specific helpers
          /@swc\/helpers/,
          /_async_to_generator/,
          /_ts_generator/,
          /_class_private_field_/,
          /_tagged_template_literal/,
          // SWC's class transform
          /function _instanceof\(left, right\)/,
          // SWC's async transform
          /_async_to_generator\(/,
          // SWC's decorators
          /Reflect\.metadata\(/,
        ],
        // Module patterns
        modules: [
          // SWC module transform patterns
          /Object\.defineProperty\(exports,\s*"__esModule"/,
          /exports\.__esModule\s*=\s*\{?\s*value:\s*true\s*\}?/,
          /function\s*_interop_require_default\(/,
        ],
        // Modern syntax transformation
        syntax: [
          // SWC's optional chaining
          /\?\.|\?\[/,
          // SWC's nullish coalescing
          /\?\?/,
          // SWC's private members
          /_class_private_field_get/,
        ],
        // Version detection
        version: [
          /"version"\s*:\s*"([^"]+)"\s*,\s*"name"\s*:\s*"@swc\/core"/,
          /\/\*\s*@swc\/core\s+([^\s*]+)\s*\*\//,
        ],
      },

      typescript: {
        // TypeScript emit patterns
        runtime: [
          // TypeScript helpers
          /__extends/,
          /__assign/,
          /__rest/,
          /__decorate/,
          /__param/,
          /__metadata/,
          /__awaiter/,
          /__generator/,
          // TypeScript class transformation
          /function\s*__extends\(d,\s*b\)/,
          // TypeScript decorators
          /function\s*__decorate\(decorators,\s*target\)/,
          // TypeScript async/await
          /function\s*__awaiter\(thisArg,\s*_arguments\)/,
        ],
        // Module patterns
        modules: [
          // TypeScript module markers
          /exports\.__esModule\s*=\s*true/,
          /Object\.defineProperty\(exports,\s*"__esModule"/,
          /require\(["'][^"']+["']\)/,
        ],
        // Syntax patterns
        syntax: [
          // TypeScript specific transforms
          /__spreadArray/,
          /__importDefault/,
          /__importStar/,
          // Enum transformation
          /\}\)\([A-Za-z0-9_$]+\s*\|\|\s*\([A-Za-z0-9_$]+\s*=\s*\{\}\)\);/,
        ],
        // Version patterns
        version: [
          /\/\*\s*ts-version:\s*([^\s*]+)\s*\*\//,
          /"typescript"\s*:\s*"([^"]+)"/,
        ],
      },

      esbuild: {
        // esbuild transformation patterns
        runtime: [
          // esbuild helpers
          /__toESM/,
          /__tla/,
          /__create/,
          /__export/,
          // esbuild class transform
          /\(\(\)\s*=>\s*\{/,
          // esbuild async transform
          /Promise\.resolve\(\)\.then\(\(\)\s*=>\s*/,
        ],
        // Module patterns
        modules: [
          // esbuild module transforms
          /import\s*\.\s*meta\s*\.\s*url/,
          /import\s*\(\s*["'][^"']+["']\s*\)/,
          /exports\s*\.\s*\w+\s*=\s*/,
        ],
        // Syntax patterns
        syntax: [
          // esbuild modern syntax
          /\?\./,
          /\?\?/,
          /#private/,
          // Class field transform
          /Object\.defineProperty\(this,\s*["'][^"']+["']/,
        ],
        // Version patterns
        version: [
          /"esbuild"\s*:\s*"([^"]+)"/,
          /\/\*\s*esbuild\s+([^\s*]+)\s*\*\//,
        ],
      },
    };

    // Get all scripts content
    const allScripts = this.resources.getAllScriptsContent();

    // Score calculation with pattern weights
    const calculateScore = (
      content: string,
      transpilerPatterns: Record<string, RegExp[]>
    ) => {
      const weights = {
        runtime: 0.4, // Runtime helpers are strong indicators
        modules: 0.3, // Module transforms are good indicators
        syntax: 0.2, // Syntax transforms are supporting indicators
        version: 0.1, // Version markers are weak indicators
      };

      let score = 0;
      const features = new Set<string>();

      for (const [category, patterns] of Object.entries(transpilerPatterns)) {
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            score += weights[category as keyof typeof weights];
            features.add(category);
          }
        }
      }

      return { score: Math.min(score, 1), features };
    };

    // Calculate scores for each transpiler
    const scores: Record<
      string,
      {
        score: number;
        features: Set<string>;
        version?: string;
      }
    > = {};

    for (const [transpiler, transpilerPatterns] of Object.entries(patterns)) {
      const { score, features } = calculateScore(
        allScripts,
        transpilerPatterns
      );

      // Try to detect version
      let version: string | undefined;
      for (const pattern of transpilerPatterns.version) {
        const match = allScripts.match(pattern);
        if (match?.[1]) {
          version = match[1];
          break;
        }
      }

      scores[transpiler] = { score, features, version };
    }

    // Additional feature detection
    const featurePatterns = {
      typescript: [
        /interface\s+\w+\s*\{/,
        /type\s+\w+\s*=/,
        /:\s*(?:string|number|boolean|any|void)\b/,
      ],
      decorators: [
        /@\w+\s*(?:\([^)]*\))?\s*(?:class|function|method)/,
        /__decorate\(/,
      ],
      classProperties: [
        /Object\.defineProperty\(.*?prototype.*?,.*?{/,
        /_classPrivateFieldSet/,
      ],
      asyncAwait: [
        /async\s+function/,
        /await\s+/,
        /__awaiter/,
        /_asyncToGenerator/,
      ],
      optionalChaining: [/\?\.|\?\[/, /_optionalChain/],
      nullishCoalescing: [/\?\?/, /_nullishCoalesce/],
      privateMembers: [/#\w+\s*[;=]/, /_classPrivateField/],
    };

    // Detect target ECMAScript version
    const detectTarget = (content: string): string => {
      if (content.includes('async') && content.includes('await'))
        return 'ES2017';
      if (content.includes('=>')) return 'ES2015';
      if (content.includes('const') || content.includes('let')) return 'ES2015';
      return 'ES5';
    };

    // Find the transpiler with highest score
    const [[mainTranspiler, details]] = Object.entries(scores).sort(
      ([, a], [, b]) => b.score - a.score
    );

    // Only consider detected if score is significant
    const isDetected = details.score > 0.3;

    if (!isDetected) {
      return {
        name: 'unknown',
        confidence: 0,
        features: {
          typescript: false,
          decorators: false,
          classProperties: false,
          asyncAwait: false,
        },
      };
    }

    // Detect features
    const detectedFeatures = Object.entries(featurePatterns).reduce(
      (acc, [feature, patterns]) => ({
        ...acc,
        [feature]: patterns.some((pattern) => pattern.test(allScripts)),
      }),
      {} as Record<string, boolean>
    );

    return {
      name: mainTranspiler,
      confidence: details.score,
      version: details.version,
      features: {
        typescript: detectedFeatures.typescript,
        decorators: detectedFeatures.decorators,
        classProperties: detectedFeatures.classProperties,
        asyncAwait: detectedFeatures.asyncAwait,
        optionalChaining: detectedFeatures.optionalChaining,
        nullishCoalescing: detectedFeatures.nullishCoalescing,
        privateMembers: detectedFeatures.privateMembers,
      },
      target: {
        ecmaVersion: detectTarget(allScripts),
      },
    };
  }

  private async detectMinifier(): Promise<MinifierResult> {
    const patterns = {
      terser: {
        // Core patterns
        syntax: [
          // Terser's function wrapper pattern
          /^(?:!\s*)?function\s*\([a-z],[a-z],[a-z]\){/,
          // Terser's module pattern
          /^(?:!\s*)?function\s*\([a-z]\){return[^}]+},?$/m,
          // Variable declarations
          /(?:var|let|const)\s+[a-z]=(?:function|{|\()/,
          // Short function assignments
          /[a-z]=[a-z]=>(?:{|\()/,
        ],
        // Variable naming patterns
        naming: [
          // Terser's variable naming strategy (single letters, then double)
          /\b[a-z]\b(?=[\.,\[\(\)])/g,
          /\b[a-z][a-z]\b(?=[\.,\[\(\)])/g,
        ],
        // Optimization patterns
        optimization: [
          // Terser's boolean optimizations
          /![01]\b/,
          /!!\d/,
          // Void operator usage
          /void 0/,
          // Property access optimization
          /\["[^"]+"\]/g,
        ],
        // Comment preservation
        comments: [
          /\/\*![\s\S]*?\*\//, // Important comments preserved
          /^\/\*[@#][\s\S]*?\*\//m, // License comments
        ],
      },

      uglifyJS: {
        // Core patterns
        syntax: [
          // UglifyJS function patterns
          /^!function\([a-z]\){/,
          // UglifyJS module wrapper
          /^!function\(([a-z],)*[a-z]\)\{/,
          // Specific optimizations
          /\|\|\{\}/,
          /&&function/,
        ],
        // Variable naming patterns
        naming: [
          // UglifyJS tends to use single letters more consistently
          /\b[a-z]\b(?=[=\.\[\(])/g,
          // Function parameter patterns
          /function\([a-z](?:,[a-z])*\)/g,
        ],
        // Optimization patterns
        optimization: [
          // UglifyJS specific optimizations
          /\+[!1]/,
          /\|\|[!1]/,
          // Comma operator usage
          /,[a-z]=(?:[a-z]|\d+)/,
        ],
        // Comment handling
        comments: [
          /\/\*[@#][\s\S]*?\*\//, // License/important comments
        ],
      },

      esbuild: {
        // Core patterns
        syntax: [
          // esbuild's more readable output
          /^var\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/m,
          // esbuild's function wrapper
          /^exports\.[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/m,
          // Module definition
          /^define\(("[^"]+",\s*)?\[/m,
        ],
        // Variable naming patterns
        naming: [
          // esbuild tends to preserve more meaningful names
          /[a-zA-Z_$][a-zA-Z0-9_$]{2,}/g,
          // Parameter naming
          /function\([a-zA-Z_$][a-zA-Z0-9_$]*\)/g,
        ],
        // Optimization patterns
        optimization: [
          // esbuild's const/let usage
          /(?:const|let)\s+[a-zA-Z_$]/,
          // Arrow function preservation
          /=>\s*{/,
          // Template literal preservation
          /`[^`]*`/,
        ],
        comments: [
          // esbuild preserves more comments by default
          /\/\*[\s\S]*?\*\//,
          /\/\/[^\n]*/,
        ],
      },

      swc: {
        // Core patterns
        syntax: [
          // swc's module wrapper
          /^!function\([\w$]+,[\w$]+\){/,
          // swc's export pattern
          /Object\.defineProperty\(exports,"__esModule",{value:!0}\)/,
          // Class transformation
          /_createClass\(/,
        ],
        // Variable naming patterns
        naming: [
          // swc's naming strategy
          /\b_?[a-zA-Z$_][0-9a-zA-Z$_]*\b/g,
          // Parameter patterns
          /function\(_?[a-zA-Z$_][0-9a-zA-Z$_]*\)/g,
        ],
        // Optimization patterns
        optimization: [
          // swc specific optimizations
          /\|\|void 0/,
          /\?\?void 0/,
          // Arrow function handling
          /=>\s*{|\(/,
        ],
        comments: [
          // swc comment preservation
          /\/\*![\s\S]*?\*\//,
          /^\/\/[/#][\s\S]*?$/m,
        ],
      },
    };

    // Helper function to calculate pattern matches
    const calculateMatches = (
      content: string,
      patternSet: RegExp[]
    ): number => {
      let matches = 0;
      patternSet.forEach((pattern) => {
        const found = content.match(pattern);
        matches += found ? found.length : 0;
      });
      return matches;
    };

    // Analyze all scripts
    const allScripts = Array.from(this.resources.getAllScripts()).join('\n');

    // Calculate metrics for code characteristics
    const metrics = {
      averageLineLength:
        allScripts
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .reduce((sum, line) => sum + line.length, 0) /
        allScripts.split('\n').length,

      singleLetterVars: (allScripts.match(/\b[a-z]\b/g) || []).length,

      hasSourceMap: Array.from(this.resources.getAll()).some((r) =>
        r.url?.endsWith('.map')
      ),

      preservedComments: (
        allScripts.match(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g) || []
      ).length,

      // Check for specific optimizations
      optimizations: {
        booleanOptimizations: (
          allScripts.match(/![01]\b|\+[!1]|\|\|[!1]/g) || []
        ).length,
        shortVarNames: (allScripts.match(/\b[a-z]\b|\b[a-z][0-9]\b/g) || [])
          .length,
        functionOptimizations: (
          allScripts.match(/[a-z]=(?:function|\([^)]*\)=>)/g) || []
        ).length,
      },
    };

    const scores = {
      terser: 0,
      uglifyJS: 0,
      esbuild: 0,
      swc: 0,
    };

    // Score each minifier based on their patterns
    Object.entries(patterns).forEach(([minifier, minifierPatterns]) => {
      const key = minifier as keyof typeof scores;

      // Check syntax patterns (highest weight)
      const syntaxMatches = calculateMatches(
        allScripts,
        minifierPatterns.syntax
      );
      scores[key] += (syntaxMatches / minifierPatterns.syntax.length) * 0.4;

      // Check naming patterns
      const namingMatches = calculateMatches(
        allScripts,
        minifierPatterns.naming
      );
      scores[key] += namingMatches > 0 ? 0.3 : 0;

      // Check optimization patterns
      const optimizationMatches = calculateMatches(
        allScripts,
        minifierPatterns.optimization
      );
      scores[key] +=
        (optimizationMatches / minifierPatterns.optimization.length) * 0.2;

      // Check comment patterns
      const commentMatches = calculateMatches(
        allScripts,
        minifierPatterns.comments
      );
      scores[key] += commentMatches > 0 ? 0.1 : 0;
    });

    // Adjust scores based on metrics
    if (metrics.averageLineLength > 500) {
      scores.terser += 0.1;
      scores.uglifyJS += 0.1;
    } else if (metrics.averageLineLength < 200) {
      scores.esbuild += 0.1;
    }

    if (metrics.preservedComments > 0) {
      scores.esbuild += 0.1;
      scores.swc += 0.1;
    }

    if (metrics.optimizations.shortVarNames > 100) {
      scores.terser += 0.1;
      scores.uglifyJS += 0.1;
    }

    // Normalize scores
    Object.keys(scores).forEach((key) => {
      scores[key as keyof typeof scores] = Math.min(
        scores[key as keyof typeof scores],
        1
      );
    });

    // Find the highest scoring minifier
    const [[detectedMinifier, maxScore]] = Object.entries(scores).sort(
      ([, a], [, b]) => b - a
    );

    // Determine features based on code analysis
    const features = {
      mangling: metrics.singleLetterVars > 50,
      compression: metrics.averageLineLength > 300,
      deadCodeElimination: metrics.optimizations.booleanOptimizations > 10,
      sourceMap: metrics.hasSourceMap,
    };

    return {
      name: maxScore > 0.3 ? detectedMinifier : 'unknown',
      confidence: maxScore,
      features,
    };
  }

  private async detectOptimizations() {
    const hasCodeSplitting = Array.from(this.resources.getAll())
      .filter((r) => r.type === 'script')
      .some((r) => r.url?.includes('chunk'));

    const hasTreeShaking = Array.from(this.resources.getAllScripts()).some(
      (script) =>
        script.includes('/*#__PURE__*/') || script.includes('/*@__PURE__*/')
    );

    const hasDynamicImports = Array.from(this.resources.getAllScripts()).some(
      (script) =>
        script.includes('import(') || script.includes('require.ensure')
    );

    return {
      codeModularity: hasDynamicImports,
      treeShaking: hasTreeShaking,
      codeSplitting: hasCodeSplitting,
    };
  }
}
