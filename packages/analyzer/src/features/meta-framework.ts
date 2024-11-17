import { Browser, Page } from 'playwright';
import { Resources } from '../resources.js';
import { calculateSimilarity } from '../utils.js';


export interface MetaFrameworkFeatures {
  name: string;
  version?: string;
  confidence: number;
  features: {
    hasAppDirectory?: boolean;
    hasServerComponents?: boolean;
    hasSSR?: boolean;
    hasSSG?: boolean;
    hasISR?: boolean;
    hasFileBasedRouting?: boolean;
    hasApi?: boolean;
    hasMiddleware?: boolean;
    dataFetching?: ('swr' | 'react-query' | 'apollo' | 'graphql')[];
  };
  detectedPatterns?: string[]; // For debugging
}

interface MetaFrameworkPatterns {
  runtime: RegExp[];
  components: RegExp[];
  markup: RegExp[];
  features: RegExp[];
  builds?: RegExp[];    // Build-specific patterns
  routing?: RegExp[];   // Routing patterns
  data?: RegExp[];      // Data fetching patterns
  ssr?: RegExp[];       // Server-side rendering patterns
}


export class MetaFrameworkFeaturesDetector {
  private page: Page;
  private resources: Resources;
  private browser: Browser;
  constructor(page: Page, resources: Resources, browser: Browser) {
    this.page = page;
    this.resources = resources;
    this.browser = browser;
  }

  async detect(): Promise<MetaFrameworkFeatures> {
    const patterns: Record<string, MetaFrameworkPatterns> = {
      next: {
        runtime: [
          // Core Next.js patterns
          /__NEXT_DATA__/,
          /__NEXT_LOADED_PAGES__/,
          /next\/router|next\/link/,
          /__next_app|__next_init/,
          // Next.js 13+ patterns
          /next\/navigation/,
          /createNextRouteHandler/,
          // App directory patterns
          /page\.tsx?$/,
          /layout\.tsx?$/,
          /loading\.tsx?$/,
          /error\.tsx?$/,
        ],
        components: [
          // Built-in components
          /next\/image/,
          /next\/script/,
          /next\/head/,
          /next\/dynamic/,
          /next\/font/,
          // App router components
          /'use client'/,
          /'use server'/,
          // Metadata
          /generateMetadata/,
        ],
        markup: [
          /data-nextjs/,
          /next-route-announcer/,
          /next-page/,
          /__next-css/,
          // Next.js specific class names
          /__next/,
          /next-error/,
          /nprogress/,
        ],
        features: [
          // Data fetching
          /getStaticProps/,
          /getServerSideProps/,
          /getInitialProps/,
          // Routing
          /useRouter|withRouter/,
          /usePathname|useSearchParams/,
          // Middleware
          /_middleware/,
          // Next.js 13+ features
          /useSelectedLayoutSegment/,
          /generateStaticParams/,
        ],
        builds: [
          // Build output
          /\.next\//,
          /next\.config\./,
          /next-env\.d\.ts/,
          // Build features
          /optimizeFonts/,
          /transpilePackages/,
          /serverComponentsExternalPackages/,
        ],
        routing: [
          // File-based routing
          /\[\.{3}\w+\]/, // catch-all routes
          /\[\w+\]/,      // dynamic routes
          // App router
          /route\.tsx?$/,
          /loading\.tsx?$/,
          /not-found\.tsx?$/,
        ],
        data: [
          // Server actions
          /'use server'/,
          /formAction/,
          // Data fetching
          /revalidatePath/,
          /revalidateTag/,
          /unstable_noStore/,
        ],
        ssr: [
          // SSR specific
          /generateStaticParams/,
          /generateMetadata/,
          /cookies\(\)/,
          /headers\(\)/,
          /notFound\(\)/,
          /redirect\(\)/,
        ]
      },

      nuxt: {
        runtime: [
          // Core Nuxt patterns
          /__NUXT__|nuxt\.config/,
          /useNuxt|defineNuxtConfig/,
          /nuxt-link|nuxt-child/,
          /nuxtjs|nuxt3/,
          // Nuxt 3 specifics
          /useNuxtApp/,
          /defineNuxtPlugin/,
        ],
        components: [
          // Built-in components
          /nuxt\/app/,
          /nuxt\/components/,
          /NuxtPage|NuxtLayout/,
          /NuxtLink|NuxtChild/,
          // Data fetching
          /useAsyncData|useFetch/,
          /useLazyFetch|useLazyAsyncData/,
        ],
        markup: [
          /data-n-head/,
          /_nuxt\/|-nuxt-/,
          /nuxt-error/,
          /nuxt-loading/,
          // Nuxt specific classes
          /nuxt-link-active/,
          /nuxt-link-exact-active/,
        ],
        features: [
          // Configuration
          /useRuntimeConfig/,
          /defineNuxtPlugin/,
          /useNuxtApp/,
          /nuxt\.config\./,
          // Composables
          /useHead|useSeoMeta/,
          /useRoute|useRouter/,
        ],
        builds: [
          // Build output
          /\.nuxt\//,
          /\.output\//,
          /nuxt\.config\./,
          // Build features
          /buildModules/,
          /transpile/,
          /nitro/,
        ],
        routing: [
          // File-based routing
          /\[\.{3}\w+\]/, // catch-all routes
          /\[\w+\]/,      // dynamic routes
          // Navigation
          /navigateTo/,
          /abortNavigation/,
        ],
        data: [
          // State management
          /useState/,
          /useAsyncData/,
          /useFetch/,
          /useLazyFetch/,
          // Server utilities
          /useRequestHeaders/,
          /useRequestEvent/,
        ],
        ssr: [
          // SSR specific
          /renderMeta/,
          /process\.server/,
          /process\.client/,
          /onServerPrefetch/,
        ]
      },

      remix: {
        runtime: [
          /@remix-run\/react/,
          /@remix-run\/node/,
          /remix\.config/,
          /entry\.client/,
          /entry\.server/,
        ],
        components: [
          /Form|Link|Meta|Links|Scripts|LiveReload/,
          /ScrollRestoration|useSubmit/,
          /Outlet/,
        ],
        markup: [
          /data-remix-/,
          /remix-prefix-/,
        ],
        features: [
          /useLoaderData|useActionData/,
          /useFetcher|useTransition/,
          /useMatches|useParams/,
        ],
        builds: [
          /remix\.config\.js/,
          /\.cache\/build/,
          /build\/index\.js/,
        ],
        routing: [
          /\[\$\w+\]\.tsx?/, // resource routes
          /\[\.\.\.\w+\]\.tsx?/, // catch-all routes
          /\[\w+\]\.tsx?/, // dynamic routes
        ],
        data: [
          /loader|action/,
          /headers|redirect/,
          /json|redirect/,
        ],
        ssr: [
          /entry\.server/,
          /handleRequest/,
          /handleDataRequest/,
        ]
      },

      gatsby: {
        runtime: [
          /gatsby-browser/,
          /gatsby-ssr/,
          /gatsby-config/,
          /gatsby-node/,
          /__GATSBY/,
        ],
        components: [
          /gatsby-link/,
          /StaticQuery/,
          /StaticImage/,
          /GatsbyImage/,
        ],
        markup: [
          /gatsby-resp-image/,
          /gatsby-image/,
        ],
        features: [
          /useStaticQuery/,
          /graphql`/,
          /pageQuery/,
        ],
        builds: [
          /\.cache\//,
          /public\//,
          /gatsby-config/,
          /gatsby-node/,
        ],
        routing: [
          /createPages/,
          /onCreatePage/,
          /gatsby-plugin-page-creator/,
        ],
        data: [
          /createPages/,
          /sourceNodes/,
          /createNode/,
        ],
        ssr: [
          /gatsby-ssr/,
          /wrapRootElement/,
          /wrapPageElement/,
        ]
      }
    };

    // const detectedFeatures: Record<string, Set<string>> = {};

    const scores: Record<keyof typeof patterns, number> = {
      next: 0,
      nuxt: 0,
      remix: 0,
      gatsby: 0,
    };

    // Score calculation based on pattern matches
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
          // detectedFeatures[category].add(category);
        }
      });
    };

    // Get all scripts and resources content
    const allScripts = this.resources.getAllScriptsContent();
    // fs.writeFile('/Users/ayavorskyi/Developer/unbuilt/allScripts.js', allScripts);


    // Check patterns for each bundler
    Object.keys(patterns).forEach(bundler => {
      const bundlerKey = bundler as keyof typeof patterns;
      checkPatterns(allScripts, bundlerKey, 'runtime', 0.3);
      checkPatterns(allScripts, bundlerKey, 'components', 0.25);
      checkPatterns(allScripts, bundlerKey, 'markup', 0.2);
      checkPatterns(allScripts, bundlerKey, 'features', 0.15);
      checkPatterns(allScripts, bundlerKey, 'builds', 0.1);
      checkPatterns(allScripts, bundlerKey, 'data', 0.1);
      checkPatterns(allScripts, bundlerKey, 'ssr', 0.1);
    });

    const [[detectedFramework, maxScore]] = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);

    const features = await this.detectMetaFrameworkFeatures(detectedFramework, allScripts); // detectedFeatures

    // Only consider it detected if score is significant
    if (maxScore < 0.3) {
      return {
        name: 'unknown',
        confidence: 0,
        features,
      };
    }

    return {
      name: detectedFramework,
      confidence: maxScore,
      features,
    };
  }

  private async detectFrameworkFeatures(framework: string): Promise<string[]> {
    const features: string[] = [];

    switch (framework) {
      case 'react':
        if (await this.hasReactRouter()) features.push('router');
        if (await this.hasRedux()) features.push('redux');
        if (await this.hasStyleComponents()) features.push('styled-components');
        break;
      case 'vue':
        if (await this.hasVueRouter()) features.push('vue-router');
        if (await this.hasVuex()) features.push('vuex');
        if (await this.hasNuxt()) features.push('nuxt');
        break;
      // Add more framework-specific feature detection
    }

    return features;
  }

  private async hasRedux(): Promise<boolean> {
    // Check for Redux in window object
    const hasReduxInWindow = await this.page!.evaluate(() => {
      // eslint-disable-next-line
      return !!(window as any).__REDUX_DEVTOOLS_EXTENSION__ || !!(window as any).__REDUX_STATE__;
    });

    // Check for Redux patterns in scripts
    const reduxPatterns = [
      'createStore',
      'combineReducers',
      'applyMiddleware',
      'bindActionCreators',
      'compose',
      'Provider',
      'connect',
      'useSelector',
      'useDispatch',
      'createSlice', // Redux Toolkit
      'configureStore', // Redux Toolkit
    ];

    const hasReduxInScripts = Array.from(this.resources.getAllScripts()).some((script) =>
      reduxPatterns.some((pattern) => script.includes(pattern))
    );

    return hasReduxInWindow || hasReduxInScripts;
  }

  private async hasReactRouter(): Promise<boolean> {
    // Check for React Router in window object
    const hasReactRouterInWindow = await this.page!.evaluate(() => {
      // eslint-disable-next-line
      return !!(window as any).ReactRouter || !!(window as any).__RouterContext;
    });

    // Check for React Router patterns in scripts
    const routerPatterns = [
      'BrowserRouter',
      'Route',
      'Switch',
      'useHistory',
      'useLocation',
      'useParams',
      'useRouteMatch',
      'withRouter',
    ];

    const hasRouterInScripts = Array.from(this.resources.getAllScripts()).some((script) =>
      routerPatterns.some((pattern) => script.includes(pattern))
    );

    // Check for router-specific DOM elements
    const hasRouterElements = await this.page!.evaluate(() => {
      return (
        !!document.querySelector('[data-reactroot] a[href]:not([href^="http"])') ||
        !!document.querySelector('nav a[href]:not([href^="http"])')
      );
    });

    return hasReactRouterInWindow || hasRouterInScripts || hasRouterElements;
  }

  private async hasRouting(framework: string): Promise<boolean> {
    switch (framework) {
      case 'react':
        return this.hasReactRouter();
      case 'vue':
        return this.hasVueRouter();
      case 'angular':
        return this.hasAngularRouter();
      default:
        return false;
    }
  }

  private async hasStateManagement(framework: string): Promise<boolean> {
    switch (framework) {
      case 'react':
        return this.hasReactStateManagement();
      case 'vue':
        return this.hasVueStateManagement();
      case 'angular':
        return this.hasAngularStateManagement();
      default:
        return false;
    }
  }

  private async hasReactStateManagement(): Promise<boolean> {
    // Check for various React state management solutions
    const hasRedux = await this.hasRedux();
    const hasMobx = await this.hasMobX();
    const hasRecoil = await this.hasRecoil();
    const hasZustand = await this.hasZustand();

    return hasRedux || hasMobx || hasRecoil || hasZustand;
  }

  private async hasMobX(): Promise<boolean> {
    const mobxPatterns = [
      'observable',
      'action',
      'computed',
      'makeObservable',
      'makeAutoObservable',
      'observer',
      'useObserver',
    ];

    return Array.from(this.resources.getAllScripts()).some((script) =>
      mobxPatterns.some((pattern) => script.includes(pattern))
    );
  }

  private async hasRecoil(): Promise<boolean> {
    const recoilPatterns = [
      'RecoilRoot',
      'atom(',
      'selector(',
      'useRecoilState',
      'useRecoilValue',
      'useSetRecoilState',
    ];

    return Array.from(this.resources.getAllScripts()).some((script) =>
      recoilPatterns.some((pattern) => script.includes(pattern))
    );
  }

  private async hasZustand(): Promise<boolean> {
    const zustandPatterns = ['create((set, get)', 'zustand/vanilla', 'useStore(', 'shallow'];

    return Array.from(this.resources.getAllScripts()).some((script) =>
      zustandPatterns.some((pattern) => script.includes(pattern))
    );
  }

  private async hasVueStateManagement(): Promise<boolean> {
    // Check for various Vue state management solutions
    const hasVuex = await this.hasVuex();
    const hasPinia = await this.hasPinia();

    return hasVuex || hasPinia;
  }

  private async hasPinia(): Promise<boolean> {
    const piniaPatterns = ['createPinia', 'defineStore', 'storeToRefs', 'usePinia'];

    return Array.from(this.resources.getAllScripts()).some((script) =>
      piniaPatterns.some((pattern) => script.includes(pattern))
    );
  }

  private async hasAngularStateManagement(): Promise<boolean> {
    // Check for various Angular state management solutions
    const hasNgrx = await this.hasNgrx();
    const hasNgxs = await this.hasNgxs();
    const hasAkita = await this.hasAkita();

    return hasNgrx || hasNgxs || hasAkita;
  }

  private async hasNgrx(): Promise<boolean> {
    const ngrxPatterns = [
      'StoreModule',
      'createAction',
      'createReducer',
      'createEffect',
      'createSelector',
    ];

    return Array.from(this.resources.getAllScripts()).some((script) =>
      ngrxPatterns.some((pattern) => script.includes(pattern))
    );
  }

  private async hasNgxs(): Promise<boolean> {
    const ngxsPatterns = ['@State', '@Action', '@Selector', 'Store.select', 'StateOperator'];

    return Array.from(this.resources.getAllScripts()).some((script) =>
      ngxsPatterns.some((pattern) => script.includes(pattern))
    );
  }

  private async hasAkita(): Promise<boolean> {
    const akitaPatterns = ['QueryEntity', 'StoreConfig', 'EntityStore', 'EntityState', 'akita'];

    return Array.from(this.resources.getAllScripts()).some((script) =>
      akitaPatterns.some((pattern) => script.includes(pattern))
    );
  }

  private async hasAngularRouter(): Promise<boolean> {
    const routerPatterns = [
      'RouterModule',
      'ActivatedRoute',
      'Router',
      'routerLink',
      'router-outlet',
    ];

    return Array.from(this.resources.getAllScripts()).some((script) =>
      routerPatterns.some((pattern) => script.includes(pattern))
    );
  }

  private async detectSSR(framework: string): Promise<boolean> {
    // First check framework-specific SSR markers
    const frameworkSSR = await this.detectFrameworkSpecificSSR(framework);
    if (frameworkSSR !== null) {
      return frameworkSSR;
    }

    // If framework-specific detection is inconclusive, try general SSR detection
    return this.detectGeneralSSR();
  }

  private async detectFrameworkSpecificSSR(framework: string): Promise<boolean | null> {
    switch (framework) {
      case 'react':
        return this.detectReactSSR();
      case 'vue':
        return this.detectVueSSR();
      case 'next':
        return this.detectNextSSR();
      case 'nuxt':
        return this.detectNuxtSSR();
      case 'angular':
        return this.detectAngularSSR();
      default:
        return null;
    }
  }
  private async detectReactSSR(): Promise<boolean> {
    // Check for React SSR markers
    return this.page!.evaluate(() => {
      // Check for specific React SSR signatures
      const markers = {
        // Data-reactroot attribute indicates React SSR
        hasReactRoot: !!document.querySelector('[data-reactroot]'),

        // React hydration markers
        hasHydrationComment: document.documentElement.innerHTML.includes('<!--$-->'),

        // Next.js specific markers
        hasNextData: !!window.__NEXT_DATA__,

        // Gatsby specific markers
        hasGatsbyData: !!window.___gatsby,

        // React hydration errors in console can indicate SSR
        hasHydrationError: window.__REACT_ERROR_OVERLAY__ !== undefined,

        // Check if content is present before JS loads
        hasInitialContent: document.body.children.length > 0,
      };

      return Object.values(markers).some(Boolean);
    });
  }

  private async detectVueSSR(): Promise<boolean> {
    return this.page!.evaluate(() => {
      const markers = {
        // Vue SSR attributes
        hasSSRAttribute: !!document.querySelector('[data-server-rendered]'),

        // Nuxt.js markers
        hasNuxtData: !!window.__NUXT__,

        // Vue meta info
        hasVueMeta: !!document.querySelector('[data-vue-meta]'),

        // Vue hydration markers
        hasHydrationMarker: document.documentElement.innerHTML.includes('<!--[-->'),

        // Check for server-rendered content
        hasInitialContent:
          document.body.children.length > 0 &&
          !document.querySelector('[id="app"]')?.children.length,
      };

      return Object.values(markers).some(Boolean);
    });
  }

  private async detectNextSSR(): Promise<boolean> {
    return this.page!.evaluate(() => {
      const markers = {
        // Next.js data object
        hasNextData: !!window.__NEXT_DATA__,

        // Next.js specific props
        hasPageProps: document.querySelector('[data-nextjs-page]') !== null,

        // Static optimization indicator
        hasStaticOptimization: !!window.__NEXT_DATA__?.autoExport,

        // Server-side generated styles
        hasSSRStyles: !!document.querySelector('style[data-n-href]'),

        // Check for specific Next.js attributes
        hasNextAttributes: document
          .querySelector('[data-reactroot]')
          ?.hasAttribute('data-nextjs-page'),
      };

      return Object.values(markers).some(Boolean);
    });
  }

  private async detectNuxtSSR(): Promise<boolean> {
    return this.page!.evaluate(() => {
      const markers = {
        // Nuxt.js window object
        hasNuxtData: !!window.__NUXT__,

        // Nuxt.js meta tags
        hasNuxtMeta: !!document.querySelector('script[data-n-head="ssr"]'),

        // Server-rendered attribute
        hasSSRAttribute: !!document.querySelector('[data-server-rendered="true"]'),

        // Nuxt.js loading indicator
        hasNuxtLoading: !!document.getElementById('nuxt-loading'),

        // Check for Nuxt.js static generation
        hasStaticGeneration: !!window.__NUXT__.staticGenerations,
      };

      return Object.values(markers).some(Boolean);
    });
  }

  private async detectAngularSSR(): Promise<boolean> {
    return this.page!.evaluate(() => {
      const root = document.querySelector('app-root');
      const markers = {
        // Angular Universal markers
        hasUniversalState: !!window.UNIVERSAL_STATE,

        // Transfer state marker
        hasTransferState: !!document.querySelector('#_TRANSFER_STATE'),

        // Platform server marker
        hasPlatformServer: document.documentElement.hasAttribute('ng-server-context'),

        // Check for prerendered content
        hasPrerenderedContent: root && root?.children?.length > 0,
      };

      return Object.values(markers).some(Boolean);
    });
  }

  private async detectGeneralSSR(): Promise<boolean> {
    // Collect multiple signals for SSR detection
    const signals = await this.collectSSRSignals();

    // Weight and score the signals
    return this.evaluateSSRSignals(signals);
  }

  private async collectSSRSignals(): Promise<Record<string, boolean>> {
    // First request - check initial HTML
    const initialResponse = await this.page!.goto(this.page!.url(), {
      waitUntil: 'domcontentloaded',
    });
    const initialHtml = (await initialResponse?.text()) || '';

    // Second request - with JS disabled
    const context = await this.browser!.newContext({
      javaScriptEnabled: false,
    });
    const noJsPage = await context.newPage();
    const noJsResponse = await noJsPage.goto(this.page!.url());
    const noJsHtml = (await noJsResponse?.text()) || '';

    // Clean up
    await context.close();

    // Compare and collect signals
    return {
      // Check if meaningful content is present without JS
      hasContentWithoutJs: noJsHtml.length > 1000 && noJsHtml.includes('</div>'),

      // Check for common SSR markers
      hasCommonSSRMarkers:
        initialHtml.includes('data-server-rendered') ||
        initialHtml.includes('data-reactroot') ||
        initialHtml.includes('data-nextjs-page') ||
        initialHtml.includes('data-n-head="ssr"'),

      // Check for hydration markers
      hasHydrationMarkers:
        initialHtml.includes('<!--$-->') ||
        initialHtml.includes('<!--[-->') ||
        initialHtml.includes('<!---->'),

      // Check for static content markers
      hasStaticMarkers: initialHtml.includes('static-page') || initialHtml.includes('prerender'),

      // Compare content with and without JS
      hasSimilarContent: calculateSimilarity(initialHtml, noJsHtml) > 0.7,

      // Check for meta tags that are typically server-rendered
      hasServerRenderedMeta: initialHtml.includes('og:') && initialHtml.includes('twitter:'),

      // Check for structured data
      hasStructuredData: initialHtml.includes('application/ld+json'),
    };
  }

  private evaluateSSRSignals(signals: Record<string, boolean>): boolean {
    // Assign weights to different signals
    const weights = {
      hasContentWithoutJs: 0.3,
      hasCommonSSRMarkers: 0.2,
      hasHydrationMarkers: 0.15,
      hasStaticMarkers: 0.1,
      hasSimilarContent: 0.15,
      hasServerRenderedMeta: 0.05,
      hasStructuredData: 0.05,
    };

    // Calculate weighted score
    const score = Object.entries(signals).reduce((total, [signal, present]) => {
      return total + (present ? weights[signal as keyof typeof weights] : 0);
    }, 0);

    // Return true if score exceeds threshold
    return score > 0.5;
  }

  private async hasStyleComponents(): Promise<boolean> {
    // Check for styled-components class patterns
    const hasStyledClasses = await this.page!.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).some((el) =>
        Array.from(el.classList).some((cls) => /^sc-[a-zA-Z0-9]/.test(cls))
      );
    });

    // Check for styled-components patterns in scripts
    const styledPatterns = ['styled.', 'createGlobalStyle', 'css`', 'withTheme', 'ThemeProvider'];

    const hasStyledInScripts = Array.from(this.resources.getAllScripts()).some((script) =>
      styledPatterns.some((pattern) => script.includes(pattern))
    );

    return hasStyledClasses || hasStyledInScripts;
  }

  private async hasVueRouter(): Promise<boolean> {
    // Check for Vue Router in window object
    const hasVueRouterInWindow = await this.page!.evaluate(() => {
      return !!window.VueRouter || !!window.$router;
    });

    // Check for Vue Router patterns in scripts
    const routerPatterns = [
      'createRouter',
      'useRouter',
      'RouterView',
      'RouterLink',
      'router-view',
      'router-link',
    ];

    const hasRouterInScripts = Array.from(this.resources.getAllScripts()).some((script) =>
      routerPatterns.some((pattern) => script.includes(pattern))
    );

    return hasVueRouterInWindow || hasRouterInScripts;
  }

  private async hasVuex(): Promise<boolean> {
    // Check for Vuex in window object
    const hasVuexInWindow = await this.page!.evaluate(() => {
      return !!window.Vuex || !!window.$store;
    });

    // Check for Vuex patterns in scripts
    const vuexPatterns = [
      'createStore',
      'useStore',
      'mapState',
      'mapGetters',
      'mapActions',
      'mapMutations',
      'commit(',
      'dispatch(',
    ];

    const hasVuexInScripts = Array.from(this.resources.getAllScripts()).some((script) =>
      vuexPatterns.some((pattern) => script.includes(pattern))
    );

    return hasVuexInWindow || hasVuexInScripts;
  }

  private async hasNuxt(): Promise<boolean> {
    // Check for Nuxt in window object
    const hasNuxtInWindow = await this.page!.evaluate(() => {
      return !!window.__NUXT__ || !!window.$nuxt;
    });

    // Check for Nuxt patterns in scripts
    const nuxtPatterns = [
      '__NUXT__',
      'useNuxt',
      'useRuntimeConfig',
      'defineNuxtConfig',
      'useNuxtApp',
    ];

    const hasNuxtInScripts = Array.from(this.resources.getAllScripts()).some((script) =>
      nuxtPatterns.some((pattern) => script.includes(pattern))
    );

    // Check for Nuxt-specific meta tags
    const hasNuxtMeta = await this.page!.evaluate(() => {
      return (
        !!document.querySelector('script[data-n-head="ssr"]') ||
        !!document.querySelector('meta[data-n-head="ssr"]')
      );
    });

    return hasNuxtInWindow || hasNuxtInScripts || hasNuxtMeta;
  }

  private detectMetaFrameworkFeatures(
    framework: string,
    content: string,
    // detectedFeatures: Record<string, Set<string>>
  ): MetaFrameworkFeatures['features'] {
    const features: MetaFrameworkFeatures['features'] = {
      hasSSR: false,
      hasSSG: false,
      hasISR: false,
      hasFileBasedRouting: false,
      hasApi: false,
      hasMiddleware: false,
      dataFetching: []
    };

    switch (framework) {
      case 'next':
        features.hasAppDirectory = /'use client'|'use server'/.test(content);
        features.hasServerComponents = features.hasAppDirectory || /server-component/.test(content);
        features.hasSSR = /getServerSideProps|getInitialProps/.test(content);
        features.hasSSG = /getStaticProps|getStaticPaths/.test(content);
        features.hasISR = /revalidate:\s*\d+/.test(content);
        features.hasFileBasedRouting = /pages\/\[\[\.\.\./.test(content) || /app\/\[\.\.\./.test(content);
        features.hasApi = /pages\/api\//.test(content) || /route\.ts/.test(content);
        features.hasMiddleware = /_middleware\.ts|middleware\.ts/.test(content);

        // Data fetching
        if (/swr/.test(content)) features.dataFetching?.push('swr');
        if (/react-query|tanstack\/query/.test(content)) features.dataFetching?.push('react-query');
        if (/apollo/.test(content)) features.dataFetching?.push('apollo');
        break;

      case 'nuxt':
        features.hasSSR = !!/nuxt\.config.*ssr:\s*true/.test(content);
        features.hasSSG = /nuxt generate/.test(content);
        features.hasFileBasedRouting = /pages\/\[/.test(content);
        features.hasApi = /server\/api\//.test(content);
        features.hasMiddleware = /middleware\//.test(content);
        break;

      case 'remix':
        features.hasSSR = true; // Remix is always SSR by default
        features.hasFileBasedRouting = /routes\//.test(content);
        features.hasApi = /action|loader/.test(content);
        features.hasMiddleware = /headers|redirect|json/.test(content);
        break;

      case 'gatsby':
        features.hasSSG = true; // Gatsby is static by default
        features.hasFileBasedRouting = /gatsby-node.*createPages/.test(content);
        features.hasApi = /gatsby-node.*sourceNodes/.test(content);
        features.dataFetching = ['graphql'];
        break;
    }

    return features;
  }
}
