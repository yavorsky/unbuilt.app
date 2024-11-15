import { chromium, Page, Browser } from 'playwright';
import { BuildFeatures, BuildFeaturesDetector } from './features/build.js';
import { ResourceAnalysis, Resources } from './resources.js';
import { ModuleFeatures, ModuleFeaturesDetector } from './features/module.js';
import { PerformanceFeatures, PerformanceFeaturesDetector } from './features/performance.js';
import { FrameworkFeatures, FrameworkFeaturesDetector } from './features/framework.js';
import { NoPageInitializedError } from './errors.js';
import { StylingFeatures, StylingFeaturesDetector } from './features/styling.js';


interface AnalysisResult {
  url: string;
  build: BuildFeatures | null;
  framework: FrameworkFeatures | null;
  styling: StylingFeatures | null;
  performance: PerformanceFeatures | null;
  modules: ModuleFeatures | null;
  resources: ResourceAnalysis;
  timestamp: string;
}

export class Analyzer {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private resources: Resources | null = null;
  private buildFeaturesDetector: BuildFeaturesDetector | null = null;
  private stylingFeaturesDetector: StylingFeaturesDetector | null = null;
  private frameworkFeaturesDetector: FrameworkFeaturesDetector | null = null;
  private moduleFeaturesDetector: ModuleFeaturesDetector | null = null;
  private performanceFeaturesDetector: PerformanceFeaturesDetector | null = null;

  constructor(page: Page, browser: Browser) {
    this.browser = browser;
    this.page = page;
  }

  async initialize() {
    await this.initializeResources();
    await this.initializeFeatures();
  }

  async initializeResources() {
    if (!this.page) {
      throw new NoPageInitializedError();
    }
    this.resources = new Resources(this.page);
    await this.resources.initialize();
  }

  async initializeFeatures() {
    if (!this.page || !this.resources || !this.browser) {
      throw new NoPageInitializedError();
    }
    this.buildFeaturesDetector = new BuildFeaturesDetector(this.page, this.resources);
    this.stylingFeaturesDetector = new StylingFeaturesDetector(this.page, this.resources);
    this.frameworkFeaturesDetector = new FrameworkFeaturesDetector(this.page, this.resources, this.browser);
    this.moduleFeaturesDetector = new ModuleFeaturesDetector(this.page, this.resources);
    this.performanceFeaturesDetector = new PerformanceFeaturesDetector(this.page, this.resources);
  }

  async analyze(url: string): Promise<AnalysisResult> {
    if (!this.page || !this.resources) {
      throw new NoPageInitializedError();
    }

    try {
      console.log(4444444);
      await this.page!.goto(url, {
        waitUntil: 'networkidle',
        timeout: 40000,
      });

      console.log('WENT TO PAGE');

      const analysis: AnalysisResult = {
        url,
        build: await this.buildFeaturesDetector?.detect() ?? null,
        framework: await this.frameworkFeaturesDetector?.detect() ?? null,
        styling: await this.stylingFeaturesDetector?.detect() ?? null,
        performance: await this.performanceFeaturesDetector?.detect() ?? null,
        modules: await this.moduleFeaturesDetector?.detect() ?? null,
        resources: await this.resources.analyze(),
        timestamp: new Date().toISOString(),
      };

      return analysis;
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    }
  }

  // private async detectModuleFeatures() {
  //   return {
  //     type: this.detectModuleType(this.scripts),
  //     hasDynamicImports: this.detectDynamicImports(this.scripts),
  //     hasTreeShaking: this.detectTreeShaking(this.scripts),
  //     hasCodeSplitting: await this.detectCodeSplitting()
  //   };
  // }

  // private detectModuleType(scripts: Set<string>) {
  //   for (const script of scripts) {
  //     if (script.includes('export ') || script.includes('import ')) {
  //       return 'esm';
  //     }
  //     if (script.includes('require') && script.includes('module.exports')) {
  //       return 'commonjs';
  //     }
  //     if (script.includes('define.amd')) {
  //       return 'amd';
  //     }
  //   }
  //   return 'unknown';
  // }

  // private detectDynamicImports(scripts: Set<string>) {
  //   return Array.from(scripts).some(script =>
  //     script.includes('import(') ||
  //     script.includes('require.ensure')
  //   );
  // }

  // private detectTreeShaking(scripts: Set<string>) {
  //   return Array.from(scripts).some(script =>
  //     script.includes('/*#__PURE__*/') ||
  //     script.includes('/*@__PURE__*/')
  //   );
  // }

  // private async detectCodeSplitting() {
  //   const chunks = new Set<string>();

  //   await this.page.route('**/*.js', route => {
  //     chunks.add(route.request().url());
  //     route.continue();
  //   });

  //   // Trigger some navigation or interaction
  //   await this.page.evaluate(() => {
  //     window.history.pushState({}, '', '/test-route');
  //   });

  //   return chunks.size > 1;
  // }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  // private async detectBuildFeatures(): Promise<BuildFeatures> {
  //   return {
  //     bundler: await this.detectBundler(),
  //     transpiler: await this.detectTranspiler(),
  //     minifier: await this.detectMinifier(),
  //     optimization: await this.detectOptimizations(),
  //   };
  // }

  // private async detectBundler() {
  //   const patterns = {
  //     webpack: ['__webpack_require__', 'webpackJsonp', 'webpack/runtime', '__webpack_exports__'],
  //     vite: [
  //       '/@vite/client',
  //       'import.meta.hot',
  //       'vite/modulepreload-polyfill',
  //       '__vite_ssr_import__',
  //     ],
  //     rollup: ['ROLLUP_ASSET_URL', 'define:__ROLLUP_', 'rollup-plugin', '__rollup_chunk'],
  //     parcel: ['parcelRequire', 'parcel-bundler', 'parcel-cache', '__parcel__import__'],
  //     esbuild: ['esbuild-loader', '__esbuild_chunk', 'esbuild-register'],
  //   };

  //   let results = Object.entries(patterns).map(([bundler, signs]) => ({
  //     name: bundler,
  //     confidence: this.calculateConfidence(signs),
  //   }));

  //   // Sort by confidence
  //   results.sort((a, b) => b.confidence - a.confidence);

  //   return {
  //     name: results[0].confidence > 0.3 ? results[0].name : 'unknown',
  //     confidence: results[0].confidence,
  //   };
  // }

  // private calculateConfidence(patterns: string[]): number {
  //   let matches = 0;
  //   const scriptsArr = Array.from(this.scripts);

  //   for (const pattern of patterns) {
  //     for (const script of scriptsArr) {
  //       if (script.includes(pattern)) {
  //         matches++;
  //         break;
  //       }
  //     }
  //   }

  //   return matches / patterns.length;
  // }

  // private async detectTranspiler() {
  //   const patterns = {
  //     babel: [
  //       '_regeneratorRuntime',
  //       '_classCallCheck',
  //       '_createClass',
  //       '@babel/runtime',
  //       'babel-polyfill',
  //     ],
  //     typescript: ['__extends', '__decorate', '__metadata', 'tslib', '__importDefault'],
  //     swc: ['@swc/helpers', '_ts_generator', '_async_to_generator', 'swc-loader'],
  //   };

  //   let results = Object.entries(patterns).map(([transpiler, signs]) => ({
  //     name: transpiler,
  //     confidence: this.calculateConfidence(signs),
  //   }));

  //   results.sort((a, b) => b.confidence - a.confidence);

  //   return {
  //     name: results[0].confidence > 0.3 ? results[0].name : 'unknown',
  //     confidence: results[0].confidence,
  //   };
  // }

  // private async detectMinifier() {
  //   // Analyze minification patterns in scripts
  //   const characteristics = Array.from(this.scripts).map((script) => ({
  //     avgLineLength: script.length / (script.match(/\n/g)?.length || 1),
  //     hasSourceMap: script.includes('//# sourceMappingURL='),
  //     hasShortVars: /\b[a-z]{1,2}\b/.test(script),
  //     hasMinPatterns: /[;,]\w+[:=]\w+/.test(script),
  //   }));

  //   // Terser typically produces more aggressive minification
  //   const terserPatterns = {
  //     shortVarNames: true,
  //     noNewlines: true,
  //     functionPatterns: /function\([a-z],[a-z],[a-z]\)/,
  //   };

  //   // UglifyJS patterns
  //   const uglifyPatterns = {
  //     wrappingPattern: /!function\(/,
  //     commaOperators: /,[a-z]=/,
  //   };

  //   // esbuild patterns
  //   const esbuildPatterns = {
  //     preservesNewlines: true,
  //     moduleWrapping: /\(()=>/,
  //   };

  //   let scores = {
  //     terser: 0,
  //     uglify: 0,
  //     esbuild: 0,
  //   };

  //   characteristics.forEach((chars) => {
  //     // Score Terser patterns
  //     if (chars.avgLineLength > 500) scores.terser += 0.3;
  //     if (chars.hasShortVars) scores.terser += 0.3;
  //     if (!chars.hasSourceMap) scores.terser += 0.2;

  //     // Score UglifyJS patterns
  //     if (chars.avgLineLength > 300) scores.uglify += 0.2;
  //     if (chars.hasMinPatterns) scores.uglify += 0.3;

  //     // Score esbuild patterns
  //     if (chars.avgLineLength < 300) scores.esbuild += 0.2;
  //     if (chars.hasSourceMap) scores.esbuild += 0.2;
  //   });

  //   const [[name, confidence]] = Object.entries(scores).sort(([, a], [, b]) => b - a);

  //   return {
  //     name,
  //     confidence: confidence / characteristics.length,
  //   };
  // }

  // private async detectOptimizations() {
  //   const hasCodeSplitting = Array.from(this.resources.values())
  //     .filter((r) => r.type === 'script')
  //     .some((r) => r.url?.includes('chunk'));

  //   const hasTreeShaking = Array.from(this.scripts).some(
  //     (script) => script.includes('/*#__PURE__*/') || script.includes('/*@__PURE__*/')
  //   );

  //   const hasDynamicImports = Array.from(this.scripts).some(
  //     (script) => script.includes('import(') || script.includes('require.ensure')
  //   );

  //   return {
  //     codeModularity: hasDynamicImports,
  //     treeShaking: hasTreeShaking,
  //     codeSplitting: hasCodeSplitting,
  //   };
  // }

  // private async detectFramework(): Promise<FrameworkFeatures> {
  //   const frameworks = await this.page!.evaluate(() => {
  //     const signs = {
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       react: !!(window as any).React || !!document.querySelector('[data-reactroot]'),
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       vue: !!(window as any).__VUE__ || !!document.querySelector('[data-v-app]'),
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       angular: !!(window as any).ng || !!document.querySelector('[ng-version]'),
  //       svelte: !!document.querySelector('style[data-svelte]'),
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       next: !!(window as any).__NEXT_DATA__,
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       nuxt: !!(window as any).__NUXT__,
  //     };

  //     const versions = {
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       react: (window as any).React?.version,
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       vue: (window as any).Vue?.version,
  //       angular: document.querySelector('[ng-version]')?.getAttribute('ng-version'),
  //     } as const;

  //     return { signs, versions };
  //   });

  //   // Determine the main framework
  //   const mainFramework = (Object.entries(frameworks.signs).find(([, present]) => present)?.[0] ||
  //     'unknown') as 'react' | 'view' | 'angular';

  //   // @ts-expect-error figure out types detection issue later
  //   const framework = frameworks.versions[mainFramework];
  //   return {
  //     name: mainFramework,
  //     version: framework,
  //     features: await this.detectFrameworkFeatures(mainFramework),
  //     meta: await this.detectFrameworkMeta(mainFramework),
  //   };
  // }

  // private async detectFrameworkFeatures(framework: string): Promise<string[]> {
  //   const features: string[] = [];

  //   switch (framework) {
  //     case 'react':
  //       if (await this.hasReactRouter()) features.push('router');
  //       if (await this.hasRedux()) features.push('redux');
  //       if (await this.hasStyleComponents()) features.push('styled-components');
  //       break;
  //     case 'vue':
  //       if (await this.hasVueRouter()) features.push('vue-router');
  //       if (await this.hasVuex()) features.push('vuex');
  //       if (await this.hasNuxt()) features.push('nuxt');
  //       break;
  //     // Add more framework-specific feature detection
  //   }

  //   return features;
  // }

  // private async hasRedux(): Promise<boolean> {
  //   // Check for Redux in window object
  //   const hasReduxInWindow = await this.page!.evaluate(() => {
  //     return !!(window as any).__REDUX_DEVTOOLS_EXTENSION__ || !!(window as any).__REDUX_STATE__;
  //   });

  //   // Check for Redux patterns in scripts
  //   const reduxPatterns = [
  //     'createStore',
  //     'combineReducers',
  //     'applyMiddleware',
  //     'bindActionCreators',
  //     'compose',
  //     'Provider',
  //     'connect',
  //     'useSelector',
  //     'useDispatch',
  //     'createSlice', // Redux Toolkit
  //     'configureStore', // Redux Toolkit
  //   ];

  //   const hasReduxInScripts = Array.from(this.scripts).some((script) =>
  //     reduxPatterns.some((pattern) => script.includes(pattern))
  //   );

  //   return hasReduxInWindow || hasReduxInScripts;
  // }

  // private async hasReactRouter(): Promise<boolean> {
  //   // Check for React Router in window object
  //   const hasReactRouterInWindow = await this.page!.evaluate(() => {
  //     return !!(window as any).ReactRouter || !!(window as any).__RouterContext;
  //   });

  //   // Check for React Router patterns in scripts
  //   const routerPatterns = [
  //     'BrowserRouter',
  //     'Route',
  //     'Switch',
  //     'useHistory',
  //     'useLocation',
  //     'useParams',
  //     'useRouteMatch',
  //     'withRouter',
  //   ];

  //   const hasRouterInScripts = Array.from(this.scripts).some((script) =>
  //     routerPatterns.some((pattern) => script.includes(pattern))
  //   );

  //   // Check for router-specific DOM elements
  //   const hasRouterElements = await this.page!.evaluate(() => {
  //     return (
  //       !!document.querySelector('[data-reactroot] a[href]:not([href^="http"])') ||
  //       !!document.querySelector('nav a[href]:not([href^="http"])')
  //     );
  //   });

  //   return hasReactRouterInWindow || hasRouterInScripts || hasRouterElements;
  // }

  // private async detectFrameworkMeta(framework: string) {
  //   return {
  //     isSSR: await this.detectSSR(framework),
  //     hasRouter: await this.hasRouting(framework),
  //     hasStateManagement: await this.hasStateManagement(framework),
  //   };
  // }

  // private async detectSSR(framework: string): Promise<boolean> {
  //   // First check framework-specific SSR markers
  //   const frameworkSSR = await this.detectFrameworkSpecificSSR(framework);
  //   if (frameworkSSR !== null) {
  //     return frameworkSSR;
  //   }

  //   // If framework-specific detection is inconclusive, try general SSR detection
  //   return this.detectGeneralSSR();
  // }

  // private async detectFrameworkSpecificSSR(framework: string): Promise<boolean | null> {
  //   switch (framework) {
  //     case 'react':
  //       return this.detectReactSSR();
  //     case 'vue':
  //       return this.detectVueSSR();
  //     case 'next':
  //       return this.detectNextSSR();
  //     case 'nuxt':
  //       return this.detectNuxtSSR();
  //     case 'angular':
  //       return this.detectAngularSSR();
  //     default:
  //       return null;
  //   }
  // }
  // private async detectReactSSR(): Promise<boolean> {
  //   // Check for React SSR markers
  //   return this.page!.evaluate(() => {
  //     // Check for specific React SSR signatures
  //     const markers = {
  //       // Data-reactroot attribute indicates React SSR
  //       hasReactRoot: !!document.querySelector('[data-reactroot]'),

  //       // React hydration markers
  //       hasHydrationComment: document.documentElement.innerHTML.includes('<!--$-->'),

  //       // Next.js specific markers
  //       hasNextData: !!(window as any).__NEXT_DATA__,

  //       // Gatsby specific markers
  //       hasGatsbyData: !!(window as any).___gatsby,

  //       // React hydration errors in console can indicate SSR
  //       hasHydrationError: (window as any).__REACT_ERROR_OVERLAY__ !== undefined,

  //       // Check if content is present before JS loads
  //       hasInitialContent: document.body.children.length > 0,
  //     };

  //     return Object.values(markers).some(Boolean);
  //   });
  // }

  // private async detectVueSSR(): Promise<boolean> {
  //   return this.page!.evaluate(() => {
  //     const markers = {
  //       // Vue SSR attributes
  //       hasSSRAttribute: !!document.querySelector('[data-server-rendered]'),

  //       // Nuxt.js markers
  //       hasNuxtData: !!(window as any).__NUXT__,

  //       // Vue meta info
  //       hasVueMeta: !!document.querySelector('[data-vue-meta]'),

  //       // Vue hydration markers
  //       hasHydrationMarker: document.documentElement.innerHTML.includes('<!--[-->'),

  //       // Check for server-rendered content
  //       hasInitialContent:
  //         document.body.children.length > 0 &&
  //         !document.querySelector('[id="app"]')?.children.length,
  //     };

  //     return Object.values(markers).some(Boolean);
  //   });
  // }

  // private async detectNextSSR(): Promise<boolean> {
  //   return this.page!.evaluate(() => {
  //     const markers = {
  //       // Next.js data object
  //       hasNextData: !!(window as any).__NEXT_DATA__,

  //       // Next.js specific props
  //       hasPageProps: document.querySelector('[data-nextjs-page]') !== null,

  //       // Static optimization indicator
  //       hasStaticOptimization: !!(window as any).__NEXT_DATA__?.autoExport,

  //       // Server-side generated styles
  //       hasSSRStyles: !!document.querySelector('style[data-n-href]'),

  //       // Check for specific Next.js attributes
  //       hasNextAttributes: document
  //         .querySelector('[data-reactroot]')
  //         ?.hasAttribute('data-nextjs-page'),
  //     };

  //     return Object.values(markers).some(Boolean);
  //   });
  // }

  // private async detectNuxtSSR(): Promise<boolean> {
  //   return this.page!.evaluate(() => {
  //     const markers = {
  //       // Nuxt.js window object
  //       hasNuxtData: !!(window as any).__NUXT__,

  //       // Nuxt.js meta tags
  //       hasNuxtMeta: !!document.querySelector('script[data-n-head="ssr"]'),

  //       // Server-rendered attribute
  //       hasSSRAttribute: !!document.querySelector('[data-server-rendered="true"]'),

  //       // Nuxt.js loading indicator
  //       hasNuxtLoading: !!document.getElementById('nuxt-loading'),

  //       // Check for Nuxt.js static generation
  //       hasStaticGeneration: !!(window as any).__NUXT__.staticGenerations,
  //     };

  //     return Object.values(markers).some(Boolean);
  //   });
  // }

  // private async detectAngularSSR(): Promise<boolean> {
  //   return this.page!.evaluate(() => {
  //     const markers = {
  //       // Angular Universal markers
  //       hasUniversalState: !!(window as any).UNIVERSAL_STATE,

  //       // Transfer state marker
  //       hasTransferState: !!document.querySelector('#_TRANSFER_STATE'),

  //       // Platform server marker
  //       hasPlatformServer: document.documentElement.hasAttribute('ng-server-context'),

  //       // Check for prerendered content
  //       hasPrerenderedContent: document.querySelector('app-root')?.children.length > 0,
  //     };

  //     return Object.values(markers).some(Boolean);
  //   });
  // }

  // private async detectGeneralSSR(): Promise<boolean> {
  //   // Collect multiple signals for SSR detection
  //   const signals = await this.collectSSRSignals();

  //   // Weight and score the signals
  //   return this.evaluateSSRSignals(signals);
  // }

  // private async collectSSRSignals(): Promise<Record<string, boolean>> {
  //   // First request - check initial HTML
  //   const initialResponse = await this.page!.goto(this.page!.url(), {
  //     waitUntil: 'domcontentloaded',
  //   });
  //   const initialHtml = (await initialResponse?.text()) || '';

  //   // Second request - with JS disabled
  //   const context = await this.browser!.newContext({
  //     javaScriptEnabled: false,
  //   });
  //   const noJsPage = await context.newPage();
  //   const noJsResponse = await noJsPage.goto(this.page!.url());
  //   const noJsHtml = (await noJsResponse?.text()) || '';

  //   // Clean up
  //   await context.close();

  //   // Compare and collect signals
  //   return {
  //     // Check if meaningful content is present without JS
  //     hasContentWithoutJs: noJsHtml.length > 1000 && noJsHtml.includes('</div>'),

  //     // Check for common SSR markers
  //     hasCommonSSRMarkers:
  //       initialHtml.includes('data-server-rendered') ||
  //       initialHtml.includes('data-reactroot') ||
  //       initialHtml.includes('data-nextjs-page') ||
  //       initialHtml.includes('data-n-head="ssr"'),

  //     // Check for hydration markers
  //     hasHydrationMarkers:
  //       initialHtml.includes('<!--$-->') ||
  //       initialHtml.includes('<!--[-->') ||
  //       initialHtml.includes('<!---->'),

  //     // Check for static content markers
  //     hasStaticMarkers: initialHtml.includes('static-page') || initialHtml.includes('prerender'),

  //     // Compare content with and without JS
  //     hasSimilarContent: this.calculateSimilarity(initialHtml, noJsHtml) > 0.7,

  //     // Check for meta tags that are typically server-rendered
  //     hasServerRenderedMeta: initialHtml.includes('og:') && initialHtml.includes('twitter:'),

  //     // Check for structured data
  //     hasStructuredData: initialHtml.includes('application/ld+json'),
  //   };
  // }

  // private evaluateSSRSignals(signals: Record<string, boolean>): boolean {
  //   // Assign weights to different signals
  //   const weights = {
  //     hasContentWithoutJs: 0.3,
  //     hasCommonSSRMarkers: 0.2,
  //     hasHydrationMarkers: 0.15,
  //     hasStaticMarkers: 0.1,
  //     hasSimilarContent: 0.15,
  //     hasServerRenderedMeta: 0.05,
  //     hasStructuredData: 0.05,
  //   };

  //   // Calculate weighted score
  //   const score = Object.entries(signals).reduce((total, [signal, present]) => {
  //     return total + (present ? weights[signal as keyof typeof weights] : 0);
  //   }, 0);

  //   // Return true if score exceeds threshold
  //   return score > 0.5;
  // }

  private calculateSimilarity(str1: string, str2: string): number {
    // Simple Jaccard similarity for text comparison
    const set1 = new Set(str1.split(/\s+/));
    const set2 = new Set(str2.split(/\s+/));

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  // private async detectStyling(): Promise<StylingFeatures> {
  //   const stylingInfo = await this.page!.evaluate(() => {
  //     const getAllStyles = () => {
  //       const styleSheets = Array.from(document.styleSheets);
  //       const styles = new Set<string>();

  //       styleSheets.forEach((sheet) => {
  //         try {
  //           if (sheet.cssRules) {
  //             Array.from(sheet.cssRules).forEach((rule) => {
  //               styles.add(rule.cssText);
  //             });
  //           }
  //         } catch (e) {
  //           // CORS might prevent reading external stylesheets
  //         }
  //       });

  //       return Array.from(styles);
  //     };

  //     const styles = getAllStyles();
  //     const classes = Array.from(document.querySelectorAll('*')).flatMap((el) =>
  //       Array.from(el.classList)
  //     );

  //     const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  //     return {
  //       styles,
  //       classes,
  //       links: stylesheets.reduce<string[]>((links, link) => {
  //         const href = link.getAttribute('href');
  //         if (href) {
  //           return links.concat(href);
  //         }
  //         return links;
  //       }, []),
  //       styleElements: document.querySelectorAll('style').length,
  //     };
  //   });

  //   return {
  //     preprocessor: this.detectPreprocessor(stylingInfo.links),
  //     frameworks: {
  //       tailwind: this.detectTailwind(stylingInfo.classes),
  //       bootstrap: this.detectBootstrap(stylingInfo.classes),
  //       mui: this.detectMUI(stylingInfo.classes),
  //       styledComponents: this.detectStyledComponents(stylingInfo.classes),
  //     },
  //     features: {
  //       hasModules: this.detectCSSModules(stylingInfo.links),
  //       hasCssInJs: this.detectCSSInJS(stylingInfo.styles),
  //       hasUtilityClasses: this.detectUtilityClasses(stylingInfo.classes),
  //     },
  //   };
  // }

  // private detectPreprocessor(links: string[] | null): string | null {
  //   if (!links) {
  //     return null;
  //   }

  //   const patterns = {
  //     sass: /\.scss$|\.sass$/,
  //     less: /\.less$/,
  //     stylus: /\.styl$/,
  //   };

  //   for (const [name, pattern] of Object.entries(patterns)) {
  //     if (links.some((href) => href && pattern.test(href))) {
  //       return name;
  //     }
  //   }

  //   return null;
  // }

  // private detectTailwind(classes: string[]): boolean {
  //   const tailwindPatterns = [
  //     /^(bg|text|border|p|m|flex|grid|w|h)-/,
  //     /^(hover|focus|active|disabled):/,
  //     /^(sm|md|lg|xl)::/,
  //   ];

  //   return tailwindPatterns.some((pattern) => classes.some((cls) => pattern.test(cls)));
  // }

  // private detectBootstrap(classes: string[]): boolean {
  //   const bootstrapPatterns = [
  //     /^(btn|col|row|container|nav|navbar|card|modal)/,
  //     /^(d-|p-|m-|bg-|text-)/,
  //   ];

  //   return bootstrapPatterns.some((pattern) => classes.some((cls) => pattern.test(cls)));
  // }

  // private detectMUI(classes: string[]): boolean {
  //   return classes.some((cls) => cls.startsWith('Mui') || cls.startsWith('makeStyles-'));
  // }

  // private detectStyledComponents(classes: string[]): boolean {
  //   return classes.some((cls) => /^sc-[a-zA-Z0-9]{5,}/.test(cls));
  // }

  // private detectCSSModules(links: string[]): boolean {
  //   return links.some((href) => href && href.includes('.module.css'));
  // }

  // private detectCSSInJS(styles: string[]): boolean {
  //   return styles.some(
  //     (style) =>
  //       style.includes('emotion') || style.includes('styled-components') || /jsx-[0-9]+/.test(style)
  //   );
  // }

  // private detectUtilityClasses(classes: string[]): boolean {
  //   const utilityPatterns = [/^(u|util)-/, /^(helper|h)-/, /^(_|--)/];

  //   return utilityPatterns.some((pattern) => classes.some((cls) => pattern.test(cls)));
  // }

  // private async detectPerformanceFeatures(): Promise<PerformanceFeatures> {
  //   const performanceMetrics = await this.page!.evaluate(() => {
  //     const resources = performance.getEntriesByType('resource');

  //     return {
  //       resourceCount: resources.length,
  //       totalSize: resources.reduce((sum, r) => sum + (r as any).transferSize, 0),
  //       scriptMetrics: {
  //         async: document.querySelectorAll('script[async]').length,
  //         defer: document.querySelectorAll('script[defer]').length,
  //         modules: document.querySelectorAll('script[type="module"]').length,
  //       },
  //       imageMetrics: {
  //         lazyLoaded: document.querySelectorAll('img[loading="lazy"]').length,
  //         total: document.querySelectorAll('img').length,
  //       },
  //     };
  //   });

  //   const response = await this.page!.goto(this.page!.url());
  //   const headers = response?.headers() || {};

  //   return {
  //     lazyLoading: {
  //       images: performanceMetrics.imageMetrics.lazyLoaded > 0,
  //       modules: performanceMetrics.scriptMetrics.modules > 0,
  //       components: await this.detectLazyComponents(),
  //     },
  //     caching: {
  //       hasCache: !!headers['cache-control'],
  //       hasETag: !!headers['etag'],
  //       hasServiceWorker: await this.detectServiceWorker(),
  //     },
  //     compression: {
  //       gzip: headers['content-encoding']?.includes('gzip') || false,
  //       brotli: headers['content-encoding']?.includes('br') || false,
  //     },
  //     optimization: {
  //       totalResources: performanceMetrics.resourceCount,
  //       totalSize: performanceMetrics.totalSize,
  //       deferredScripts: performanceMetrics.scriptMetrics.defer,
  //       asyncScripts: performanceMetrics.scriptMetrics.async,
  //     },
  //   };
  // }

  // private async detectLazyComponents(): Promise<boolean> {
  //   const dynamicImports = Array.from(this.scripts).some((script) => script.includes('import('));

  //   const reactLazy = Array.from(this.scripts).some(
  //     (script) => script.includes('React.lazy') || script.includes('lazy(')
  //   );

  //   const vueLazy = Array.from(this.scripts).some(
  //     (script) => script.includes('() => import(') || script.includes('defineAsyncComponent')
  //   );

  //   return dynamicImports || reactLazy || vueLazy;
  // }

  // private async detectServiceWorker(): Promise<boolean> {
  //   return this.page!.evaluate(
  //     () =>
  //       !!navigator.serviceWorker?.controller ||
  //       !!document.querySelector('script[src*="service-worker"]')
  //   );
  // }

  // private async analyzeResources(): Promise<ResourceFeatures> {
  //   const resources = Array.from(this.resources.values());

  //   const jsResources = resources.filter((r) => r.type === 'script');
  //   const cssResources = resources.filter((r) => r.type === 'stylesheet');
  //   const imageResources = resources.filter((r) => r.type === 'image');
  //   const fontResources = resources.filter((r) => r.type === 'font');

  //   return {
  //     js: {
  //       count: jsResources.length,
  //       size: jsResources.reduce((sum, r) => sum + r.size, 0),
  //       external: jsResources.filter((r) => !r.url.includes(this.page!.url())).length,
  //       inline: await this.countInlineScripts(),
  //     },
  //     css: {
  //       count: cssResources.length,
  //       size: cssResources.reduce((sum, r) => sum + r.size, 0),
  //       external: cssResources.filter((r) => !r.url.includes(this.page!.url())).length,
  //       inline: await this.countInlineStyles(),
  //     },
  //     images: {
  //       count: imageResources.length,
  //       size: imageResources.reduce((sum, r) => sum + r.size, 0),
  //       optimized: await this.countOptimizedImages(),
  //     },
  //     fonts: {
  //       count: fontResources.length,
  //       size: fontResources.reduce((sum, r) => sum + r.size, 0),
  //       preloaded: await this.countPreloadedFonts(),
  //     },
  //   };
  // }

  // private async countInlineScripts(): Promise<number> {
  //   return this.page!.evaluate(() => document.querySelectorAll('script:not([src])').length);
  // }

  // private async countInlineStyles(): Promise<number> {
  //   return this.page!.evaluate(() => document.querySelectorAll('style').length);
  // }

  // private async countOptimizedImages(): Promise<number> {
  //   return this.page!.evaluate(
  //     () => document.querySelectorAll('img[srcset], img[loading="lazy"], picture source').length
  //   );
  // }

  // private async countPreloadedFonts(): Promise<number> {
  //   return this.page!.evaluate(
  //     () => document.querySelectorAll('link[rel="preload"][as="font"]').length
  //   );
  // }
}
