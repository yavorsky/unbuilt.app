import { Page } from 'playwright';
import { Resources } from '../resources';

export interface FrameworkFeatures {
  name: string;
  version?: string;
  features: string[];
  meta: {
    isSSR: boolean;
    hasRouter: boolean;
    hasStateManagement: boolean;
  };
}

export class FrameworkFeaturesDetector {
  private page: Page;
  private resources: Resources;
  constructor(page: Page, resources: Resources) {
    this.page = page;
    this.resources = resources;
  }

  async detect(): Promise<FrameworkFeatures> {
    const frameworks = await this.page!.evaluate(() => {
      const signs = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        react: !!(window as any).React || !!document.querySelector('[data-reactroot]'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vue: !!(window as any).__VUE__ || !!document.querySelector('[data-v-app]'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        angular: !!(window as any).ng || !!document.querySelector('[ng-version]'),
        svelte: !!document.querySelector('style[data-svelte]'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: !!(window as any).__NEXT_DATA__,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nuxt: !!(window as any).__NUXT__,
      };

      const versions = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        react: (window as any).React?.version,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vue: (window as any).Vue?.version,
        angular: document.querySelector('[ng-version]')?.getAttribute('ng-version'),
      } as const;

      return { signs, versions };
    });

    // Determine the main framework
    const mainFramework = (Object.entries(frameworks.signs).find(([, present]) => present)?.[0] ||
      'unknown') as 'react' | 'view' | 'angular';

    // @ts-expect-error figure out types detection issue later
    const framework = frameworks.versions[mainFramework];
    return {
      name: mainFramework,
      version: framework,
      features: await this.detectFrameworkFeatures(mainFramework),
      meta: await this.detectFrameworkMeta(mainFramework),
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

    const hasReduxInScripts = Array.from(this.scripts).some((script) =>
      reduxPatterns.some((pattern) => script.includes(pattern))
    );

    return hasReduxInWindow || hasReduxInScripts;
  }

  private async hasReactRouter(): Promise<boolean> {
    // Check for React Router in window object
    const hasReactRouterInWindow = await this.page!.evaluate(() => {
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

    const hasRouterInScripts = Array.from(this.scripts).some((script) =>
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

  private async detectFrameworkMeta(framework: string) {
    return {
      isSSR: await this.detectSSR(framework),
      hasRouter: await this.hasRouting(framework),
      hasStateManagement: await this.hasStateManagement(framework),
    };
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
        hasNextData: !!(window as any).__NEXT_DATA__,

        // Gatsby specific markers
        hasGatsbyData: !!(window as any).___gatsby,

        // React hydration errors in console can indicate SSR
        hasHydrationError: (window as any).__REACT_ERROR_OVERLAY__ !== undefined,

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
        hasNuxtData: !!(window as any).__NUXT__,

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
        hasNextData: !!(window as any).__NEXT_DATA__,

        // Next.js specific props
        hasPageProps: document.querySelector('[data-nextjs-page]') !== null,

        // Static optimization indicator
        hasStaticOptimization: !!(window as any).__NEXT_DATA__?.autoExport,

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
        hasNuxtData: !!(window as any).__NUXT__,

        // Nuxt.js meta tags
        hasNuxtMeta: !!document.querySelector('script[data-n-head="ssr"]'),

        // Server-rendered attribute
        hasSSRAttribute: !!document.querySelector('[data-server-rendered="true"]'),

        // Nuxt.js loading indicator
        hasNuxtLoading: !!document.getElementById('nuxt-loading'),

        // Check for Nuxt.js static generation
        hasStaticGeneration: !!(window as any).__NUXT__.staticGenerations,
      };

      return Object.values(markers).some(Boolean);
    });
  }

  private async detectAngularSSR(): Promise<boolean> {
    return this.page!.evaluate(() => {
      const markers = {
        // Angular Universal markers
        hasUniversalState: !!(window as any).UNIVERSAL_STATE,

        // Transfer state marker
        hasTransferState: !!document.querySelector('#_TRANSFER_STATE'),

        // Platform server marker
        hasPlatformServer: document.documentElement.hasAttribute('ng-server-context'),

        // Check for prerendered content
        hasPrerenderedContent: document.querySelector('app-root')?.children.length > 0,
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
      hasSimilarContent: this.calculateSimilarity(initialHtml, noJsHtml) > 0.7,

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
      return Array.from(document.querySelectorAll('*'))
        .some(el => Array.from(el.classList)
          .some(cls => /^sc-[a-zA-Z0-9]/.test(cls)));
    });

    // Check for styled-components patterns in scripts
    const styledPatterns = [
      'styled.',
      'createGlobalStyle',
      'css`',
      'withTheme',
      'ThemeProvider'
    ];

    const hasStyledInScripts = Array.from(this.scripts).some(script =>
      styledPatterns.some(pattern => script.includes(pattern))
    );

    return hasStyledClasses || hasStyledInScripts;
  }

  private async hasVueRouter(): Promise<boolean> {
    // Check for Vue Router in window object
    const hasVueRouterInWindow = await this.page!.evaluate(() => {
      return !!(window as any).VueRouter ||
             !!(window as any).$router;
    });

    // Check for Vue Router patterns in scripts
    const routerPatterns = [
      'createRouter',
      'useRouter',
      'RouterView',
      'RouterLink',
      'router-view',
      'router-link'
    ];

    const hasRouterInScripts = Array.from(this.scripts).some(script =>
      routerPatterns.some(pattern => script.includes(pattern))
    );

    return hasVueRouterInWindow || hasRouterInScripts;
  }

  private async hasVuex(): Promise<boolean> {
    // Check for Vuex in window object
    const hasVuexInWindow = await this.page!.evaluate(() => {
      return !!(window as any).Vuex ||
             !!(window as any).$store;
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
      'dispatch('
    ];

    const hasVuexInScripts = Array.from(this.scripts).some(script =>
      vuexPatterns.some(pattern => script.includes(pattern))
    );

    return hasVuexInWindow || hasVuexInScripts;
  }

  private async hasNuxt(): Promise<boolean> {
    // Check for Nuxt in window object
    const hasNuxtInWindow = await this.page!.evaluate(() => {
      return !!(window as any).__NUXT__ ||
             !!(window as any).$nuxt;
    });

    // Check for Nuxt patterns in scripts
    const nuxtPatterns = [
      '__NUXT__',
      'useNuxt',
      'useRuntimeConfig',
      'defineNuxtConfig',
      'useNuxtApp'
    ];

    const hasNuxtInScripts = Array.from(this.scripts).some(script =>
      nuxtPatterns.some(pattern => script.includes(pattern))
    );

    // Check for Nuxt-specific meta tags
    const hasNuxtMeta = await this.page!.evaluate(() => {
      return !!document.querySelector('script[data-n-head="ssr"]') ||
             !!document.querySelector('meta[data-n-head="ssr"]');
    });

    return hasNuxtInWindow || hasNuxtInScripts || hasNuxtMeta;
  }
};