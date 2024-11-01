import { Page } from "playwright"

export interface BundleAnalysis {
  // Highly detectable
  definitelyDetectable: {
    // Webpack
    webpack: {
      signals: [
        '__webpack_require__',
        'webpackJsonp',
        'webpack-dev-server',
        'webpack/runtime/chunk loaded'
      ],
      confidence: 'high'
    },
    // Vite
    vite: {
      signals: [
        '/@vite/client',
        'import.meta.hot',
        'vite/modulepreload-polyfill'
      ],
      confidence: 'high'
    },
    // Rollup
    rollup: {
      signals: [
        'ROLLUP_ASSET_URL',
        'define:__ROLLUP_',
        'rollup-plugin'
      ],
      confidence: 'high'
    }
  },

  // Partially detectable
  possiblyDetectable: {
    // Transpilers
    transpiler: {
      babel: {
        signals: [
          '_regeneratorRuntime',
          '_classCallCheck',
          '_createClass',
          'require("@babel/runtime")'
        ],
        confidence: 'medium'
      },
      typescript: {
        signals: [
          '__extends',
          '__decorate',
          '__metadata',
          'tslib'
        ],
        confidence: 'medium'
      },
      swc: {
        // Harder to detect, similar output to Babel
        signals: [
          '@swc/helpers',
          '_ts_generator'
        ],
        confidence: 'low'
      }
    },

    // Minifiers
    minifier: {
      terser: {
        // Can look for specific patterns in minified code
        patterns: [
          'function(e,t,n)',
          'function(e){return e}',
        ],
        confidence: 'low'
      },
      esbuild: {
        // Very hard to definitively detect
        patterns: [
          // Specific patterns are less reliable
        ],
        confidence: 'very low'
      }
    }
  },

  // Additional detectable features
  buildFeatures: {
    codeModularity: {
      // Check for code splitting
      hasCodeSplitting: boolean,
      // Dynamic imports
      hasDynamicImports: boolean,
      // Tree shaking signals
      hasTreeShaking: boolean
    },
    optimization: {
      // Source maps presence
      hasSourceMaps: boolean,
      // Asset optimization
      hasOptimizedAssets: boolean,
      // Modern JS features usage
      usesModernJSFeatures: boolean
    }
  }
}

interface MinificationSignature {
  name: string;
  confidence: number;
  patterns: {
    pattern: string | RegExp;
    weight: number;
  }[];
  characteristics: {
    check: (code: string) => boolean;
    weight: number;
  }[];
}

// Implementation approach
export class BundleAnalyzer {
  async analyzePage(page: Page) {
    const scripts = await this.getAllScripts(page);
    const analysis = {
      bundler: await this.detectBundler(scripts),
      transpiler: await this.detectTranspiler(scripts),
      minifier: await this.detectMinifier(scripts),
      features: await this.detectFeatures(scripts)
    };

    // Calculate confidence scores
    return this.addConfidenceScores(analysis);
  }

  private signatures: MinificationSignature[] = [
    {
      name: 'Terser',
      confidence: 0,
      patterns: [
        // Terser tends to use single-letter variables consistently
        { pattern: /\b[a-z]\b(?=[\.,\[\(\)])/g, weight: 0.3 },
        // Terser's function argument patterns
        { pattern: /function\([a-z],[a-z],[a-z]\)/, weight: 0.4 },
        // Terser's typical variable declarations
        { pattern: /var [a-z]=/, weight: 0.3 },
      ],
      characteristics: [
        {
          // Terser often preserves some newlines
          check: (code) => code.split('\n').length > 1,
          weight: 0.2
        },
        {
          // Terser's semicolon placement
          check: (code) => /;[}\]]/.test(code),
          weight: 0.3
        }
      ]
    },
    {
      name: 'UglifyJS',
      confidence: 0,
      patterns: [
        // UglifyJS often uses shorter function declarations
        { pattern: /function [a-z]\([a-z]\)/, weight: 0.4 },
        // UglifyJS's variable naming pattern
        { pattern: /\b[a-z]{1,2}\b(?=\=)/g, weight: 0.3 },
        // UglifyJS's typical function wrapping
        { pattern: /!function\(/, weight: 0.5 },
      ],
      characteristics: [
        {
          // UglifyJS typically removes all newlines
          check: (code) => code.split('\n').length === 1,
          weight: 0.4
        },
        {
          // UglifyJS's comma usage
          check: (code) => /,[a-z]=/.test(code),
          weight: 0.3
        }
      ]
    },
    {
      name: 'esbuild',
      confidence: 0,
      patterns: [
        // esbuild's export handling
        { pattern: /Object\.defineProperty\(exports,"__esModule",{value:!0}\)/, weight: 0.6 },
        // esbuild's typical variable declarations
        { pattern: /let [a-z]=/, weight: 0.3 },
        // esbuild's function patterns
        { pattern: /=>\{/, weight: 0.2 },
      ],
      characteristics: [
        {
          // esbuild tends to preserve certain whitespace
          check: (code) => /\) {/.test(code),
          weight: 0.3
        },
        {
          // esbuild's module wrapping
          check: (code) => code.includes('(()=>'),
          weight: 0.4
        }
      ]
    }
  ];

  async detectMinifier(code: string) {
    // Reset confidence scores
    this.signatures.forEach(sig => sig.confidence = 0);

    // Analyze code characteristics
    const stats = this.analyzeCode(code);

    // Check each signature
    for (const signature of this.signatures) {
      // Check patterns
      for (const { pattern, weight } of signature.patterns) {
        const matches = (code.match(pattern) || []).length;
        if (matches > 0) {
          signature.confidence += weight * Math.min(matches / 10, 1);
        }
      }

      // Check characteristics
      for (const { check, weight } of signature.characteristics) {
        if (check(code)) {
          signature.confidence += weight;
        }
      }
    }

    // Find the most likely minifier
    const result = this.signatures
      .filter(sig => sig.confidence > 0.3) // Minimum confidence threshold
      .sort((a, b) => b.confidence - a.confidence);

    if (result.length === 0) {
      return {
        minifier: 'unknown',
        confidence: 0,
        characteristics: stats
      };
    }

    return {
      minifier: result[0].name,
      confidence: result[0].confidence,
      characteristics: stats,
      alternatives: result.slice(1).map(r => ({
        name: r.name,
        confidence: r.confidence
      }))
    };
  }

  private async getAllScripts(page: Page) {
    const scripts = new Set<string>();

    // Intercept and store all JS
    await page.route('**/*.js', async route => {
      const response = await route.fetch();
      const content = await response.text();
      scripts.add(content);
      await route.continue();
    });

    // Also check inline scripts
    const inlineScripts = await page.evaluate(() => {
      return Array.from(document.getElementsByTagName('script'))
        .map(script => script.innerHTML)
        .filter(Boolean);
    });

    inlineScripts.forEach(script => scripts.add(script));
    return scripts;
  }

  private async detectBundler(scripts: Set<string>): Promise<BundlerInfo> {
    let signals = {
      webpack: 0,
      vite: 0,
      rollup: 0,
      parcel: 0
    };

    for (const script of scripts) {
      // Webpack detection
      if (script.includes('__webpack_require__')) signals.webpack += 2;
      if (script.includes('webpackJsonp')) signals.webpack += 2;

      // Vite detection
      if (script.includes('/@vite/client')) signals.vite += 2;
      if (script.includes('import.meta.hot')) signals.vite += 1;

      // Rollup detection
      if (script.includes('ROLLUP_ASSET_URL')) signals.rollup += 2;
      if (script.includes('define:__ROLLUP_')) signals.rollup += 2;
    }

    // Return bundler with highest confidence
    return this.getHighestConfidence(signals);
  }

  private async detectTranspiler(scripts: Set<string>): Promise<TranspilerInfo> {
    const signals = {
      babel: 0,
      typescript: 0,
      swc: 0
    };

    for (const script of scripts) {
      // Babel detection
      if (script.includes('_regeneratorRuntime')) signals.babel += 1;
      if (script.includes('@babel/runtime')) signals.babel += 2;

      // TypeScript detection
      if (script.includes('__extends')) signals.typescript += 1;
      if (script.includes('tslib')) signals.typescript += 2;

      // SWC detection (less reliable)
      if (script.includes('@swc/helpers')) signals.swc += 1;
    }

    return this.getHighestConfidence(signals);
  }

  private analyzeMinification(script: string) {
    return {
      // Average line length
      avgLineLength: this.getAverageLineLength(script),
      // Presence of source maps
      hasSourceMap: script.includes('//# sourceMappingURL='),
      // Variable name patterns
      hasShortVarNames: /\b[a-z]{1,2}\b/.test(script),
      // Common minification patterns
      hasMinificationPatterns: /[;,]\w+[:=]\w+/.test(script)
    };
  }
}