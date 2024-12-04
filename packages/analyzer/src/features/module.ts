import { Page } from 'playwright';
import { Resources } from '../resources.js';

type ModuleTypeResult =
  | 'esm'
  | 'commonjs'
  | 'amd'
  | 'umd'
  | 'systemjs'
  | 'unknown';
type ModuleType = Exclude<ModuleTypeResult, 'unknown'>;

type ModuleFeatures = {
  dynamicImports?: boolean;
  asyncModules?: boolean;
  namedExports?: boolean;
  defaultExports?: boolean;
  reexports?: boolean;
  interopWithOtherSystems?: boolean;
  mixedSystems?: ModuleType[];
};

export interface ModuleResult {
  type: ModuleTypeResult;
  confidence: number;
  features: ModuleFeatures;
}

type PatternsGroups = {
  imports: { patterns: RegExp[]; score?: number };
  exports: { patterns: RegExp[]; score?: number };
  features: { patterns: RegExp[]; score?: number };
};
type PatternsConfig = Record<ModuleType, PatternsGroups>;

export class ModuleFeaturesDetector {
  private page: Page;
  private resources: Resources;
  constructor(page: Page, resources: Resources) {
    this.page = page;
    this.resources = resources;
  }

  async detect(): Promise<ModuleResult> {
    const patterns: PatternsConfig = {
      esm: {
        // Static imports
        imports: {
          patterns: [
            /import\s+{[^}]+}\s+from\s+['"][^'"]+['"]/, // named imports
            /import\s+\*\s+as\s+\w+\s+from\s+['"][^'"]+['"]/, // namespace imports
            /import\s+\w+\s+from\s+['"][^'"]+['"]/, // default imports
            /import\s+['"][^'"]+['"]/, // bare imports
            /import\s*\(/, // dynamic imports
          ],
          score: 0.2,
        },
        // Exports
        exports: {
          patterns: [
            /export\s+{\s*[^}]+\s*}/, // named exports
            /export\s+default\s+/, // default exports
            /export\s+class\s+/, // class exports
            /export\s+function\s+/, // function exports
            /export\s+const\s+/, // const exports
            /export\s+\*\s+from\s+/, // re-exports
            /export\s+type\s+/, // TypeScript type exports
          ],
          score: 0.2,
        },
        // Module features
        features: {
          patterns: [
            /import\.meta/, // import.meta usage
            /await\s+import\(/, // top-level await
          ],
          score: 0.1,
        },
      },

      commonjs: {
        // Require patterns
        imports: {
          patterns: [
            /require\(['"][^'"]+['"]\)/, // basic require
            /require\.resolve\(/, // require.resolve
            /require\(`.+`\)/, // template literal require
          ],
          score: 0.25,
        },
        // Exports patterns
        exports: {
          patterns: [
            /module\.exports\s*=/, // module.exports assignment
            /exports\.\w+\s*=/, // exports property
            /Object\.defineProperty\(exports,/, // defineProperty exports
            /exports\s*=\s*module\.exports\s*=/, // exports = module.exports
          ],
          score: 0.25,
        },
        // CommonJS features
        features: {
          patterns: [
            /require\.cache/, // require cache
            /require\.main/, // main module
            /__dirname/, // dirname usage
            /__filename/, // filename usage
          ],
          score: 0.1,
        },
      },

      amd: {
        // Require patterns
        imports: {
          patterns: [
            /require\s*\(\s*\[/, // require with array
            /requirejs\s*\(/, // requirejs usage
            /require\.config\(/, // require config
          ],
          score: 0.3,
        },
        // Define patterns
        exports: {
          patterns: [
            /define\s*\(\s*\[/, // define with dependencies
            /define\s*\(\s*function/, // define with function
            /define\s*\(\s*['"][^'"]+['"]\s*,/, // named define
            /define\.amd/, // AMD marker
          ],
          score: 0.2,
        },
        // AMD features
        features: {
          patterns: [
            /define\s*\(\s*['"][^'"]+['"]\s*,\s*\[/, // named modules
            /require\.specified/, // module checking
            /require\.toUrl/, // URL conversion
          ],
          score: 0.1,
        },
      },

      umd: {
        imports: { patterns: [] },
        exports: {
          patterns: [
            /typeof\s+define\s*===?\s*['"]function['"]\s*&&\s*define\.amd/,
            /\(function\s*\(root,\s*factory\)/,
            /typeof\s+exports\s*===?\s*['"]object['"]/,
            /typeof\s+module\s*===?\s*['"]object['"]/,
            /\(this,\s*function\s*\([^)]*\)\s*{/,
            // Common UMD factories
            /factory\((typeof exports === 'object' \? exports : root)\)/,
          ],
          score: 0.4,
        },
        features: {
          patterns: [/root\[\s*['"][^'"]+['"]\s*\]\s*=\s*factory/],
          score: 0.3,
        },
      },

      systemjs: {
        imports: {
          patterns: [/System\.register/, /SystemJS\.import/, /System\.set/],
          score: 0.4,
        },
        exports: { patterns: [] },
        features: { patterns: [/System\.config/], score: 0.4 },
      },
    };

    const scores = {
      esm: 0,
      commonjs: 0,
      amd: 0,
      umd: 0,
      systemjs: 0,
    };

    const checkPatterns = <T extends ModuleType>(
      content: string,
      moduleSystem: T,
      category: keyof PatternsGroups
    ) => {
      const patternsConfig = patterns[moduleSystem][category];

      patternsConfig.patterns.forEach((pattern: RegExp) => {
        if (pattern.test(content)) {
          scores[moduleSystem] += patternsConfig?.score ?? 0;
        }
      });
    };

    // Get all scripts and resources content
    const allScripts = this.resources.getAllScriptsContent();

    // Check patterns for each bundler
    Object.keys(patterns).forEach((bundler) => {
      const bundlerKey = bundler as keyof typeof patterns;
      // Runtime patterns are strong indicators
      checkPatterns(allScripts, bundlerKey, 'imports');
      // Asset patterns are good indicators
      checkPatterns(allScripts, bundlerKey, 'exports');
      // Build patterns are strong indicators
      checkPatterns(allScripts, bundlerKey, 'features');
    });

    const entries = Object.entries(scores) as [ModuleType, number][];
    const [[detectedType, maxScore]] = entries.sort(([, a], [, b]) => b - a);

    const features = this.detectModuleFeatures(allScripts, entries);

    if (maxScore < 0.3) {
      return {
        type: 'unknown',
        confidence: 0,
        features,
      };
    }

    const mixedSystems = features?.mixedSystems;

    if (mixedSystems && mixedSystems.length > 1) {
      // If UMD is one of the detected systems, it's likely intentional
      if (mixedSystems.includes('umd')) {
        return {
          type: 'umd',
          confidence: scores.umd,
          features,
        };
      }
    }

    return {
      type: detectedType,
      confidence: maxScore,
      features,
    };
  }

  detectModuleFeatures(
    allScripts: string,
    entries: [ModuleType, number][]
  ): ModuleFeatures {
    const mixedSystems = entries
      .filter(([, score]) => score >= 0.3)
      .map(([type]) => type);

    const features = {
      dynamicImports: /import\s*\(/.test(allScripts),
      asyncModules: /async\s+function|await\s+import/.test(allScripts),
      namedExports: /export\s*{|exports\.\w+\s*=/.test(allScripts),
      defaultExports: /export\s+default|module\.exports\s*=/.test(allScripts),
      reexports: /export\s*\*\s*from|Object\.assign\(exports,/.test(allScripts),
      interopWithOtherSystems:
        mixedSystems.length > 1 ||
        /.__esModule|interopDefault|createCommonJS/.test(allScripts),
      mixedSystems,
    };

    return features;
  }
}
