import { Browser, Page } from 'playwright';
import { Resources } from '../resources.js';
import { calculateSimilarity } from '../utils.js';

type UILibraries = {
  stateManagement: string[];
  router: string[];
} | null;
export interface UILibFeatures {
  name: string;
  version?: string;
  confidence: number;
  libraries: UILibraries;
}

interface UILibPatterns {
  runtime: RegExp[];
  components: RegExp[];
  markup: RegExp[];
  features: RegExp[];
  state?: RegExp[]; // New category for state management
  routing?: RegExp[]; // New category for routing
  styling?: RegExp[]; // New category for styling solutions
}

export class UILibFeaturesDetector {
  private page: Page;
  private resources: Resources;
  private browser: Browser;
  constructor(page: Page, resources: Resources, browser: Browser) {
    this.page = page;
    this.resources = resources;
    this.browser = browser;
  }

  async detect(): Promise<UILibFeatures> {
    const patterns: Record<string, UILibPatterns> = {
      react: {
        runtime: [
          // Core React patterns
          /(?:React|react)\.(?:createElement|Component|Fragment|useState|useEffect|memo)/,
          /__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED/,
          /\$\$typeof|Symbol\.for\("react\.element"\)/,
          /_jsx|_jsxs|_jsxDEV/,
          /react-dom/,
          // React 18 specific
          /createRoot|hydrateRoot/,
          /useId|useDeferredValue|useTransition/,
          /Suspense|useInsertionEffect/,
          // React experimental
          /unstable_|experimental_/,
        ],
        components: [
          /className=/,
          /onClick=/,
          /onChange=/,
          /data-reactroot/,
          /[rR]eact\.lazy\(/,
          // Common patterns
          /[A-Z][a-zA-Z]*\s*\{/, // Component declarations
          /React\.memo\(/,
          /forwardRef\(/,
          /useImperativeHandle/,
          // Props patterns
          /props\.[a-zA-Z]/,
          /{\s*\.{3}props\s*}/, // Props spreading
        ],
        markup: [
          /<\/?[A-Z][A-Za-z0-9]*>/,
          /<!--\$-->|<!--\$!-->/,
          /data-reactid/,
          /hydrate(?:Root)?/,
          // JSX patterns
          /<>\s*</, // Fragment shorthand
          /<\/>/, // Fragment closing
          /\{\s*children\s*\}/, // Children prop
        ],
        features: [
          /useCallback|useMemo|useContext|useReducer|useRef/,
          /Suspense|StrictMode|Fragment|Portal/,
          /createPortal|flushSync|startTransition/,
          // Modern features
          /useSyncExternalStore/,
          /useLayoutEffect/,
          /Profiler|StrictMode/,
        ],
        state: [
          // Redux
          /createStore|combineReducers|applyMiddleware/,
          /useSelector|useDispatch/,
          /createSlice|configureStore/,
          // Zustand
          /create\(\s*\(\s*set\s*,\s*get\s*\)/,
          // Recoil
          /RecoilRoot|atom|selector|useRecoilState/,
          // Jotai
          /atom\(/,
          // XState
          /createMachine|useMachine/,
        ],
        routing: [
          // React Router
          /BrowserRouter|Routes|Route/,
          /useNavigate|useParams|useLocation/,
          /NavLink|Link/,
          // TanStack Router
          /createRouter|useRouter/,
          /routeTree|parseRoute/,
        ],
        styling: [
          // Styled Components
          /styled\.[a-z]+`|styled\([^)]+\)`/,
          // Emotion
          /css`|styled\.div`/,
          // CSS Modules
          /styles\.[a-zA-Z]/,
          /\.module\.css/,
          // Tailwind
          /className="[^"]*(?:bg-|text-|p-|m-)/,
        ],
      },
      preact: {
        runtime: [
          /import\s*{\s*[^}]*}\s*from\s*['"]preact['"]/,
          /h\s*\(/,
          /render\s*\(/,
          /preact\/hooks/,
          /preact\/compat/,
        ],
        components: [
          /className=/,
          /onClick=/,
          /onChange=/,
          // Preact specific
          /class\s+extends\s+Component/,
          /props\./,
          /this\.state\./,
        ],
        markup: [
          /<\/?[A-Z][A-Za-z0-9]*>/,
          /hydrate\(/,
          // JSX in Preact
          /<>\s*</,
          /<\/>/,
        ],
        features: [
          /useCallback|useMemo|useContext|useReducer|useRef/,
          /useEffect|useState/,
          /createPortal/,
          // Preact signals
          /useSignal|useComputed/,
        ],
      },
      solid: {
        runtime: [
          /import\s*{\s*[^}]*}\s*from\s*['"]solid-js['"]/,
          /createSignal|createEffect|createMemo/,
          /createResource|createStore/,
          /solid-js\/web/,
        ],
        components: [
          /className=/,
          /onClick=/,
          /onChange=/,
          // Solid specific
          /on:|bind:/,
          /use:/,
          /prop:/,
        ],
        markup: [
          /<For\s*\{/,
          /<Show\s*\{/,
          /<Switch\s*\{/,
          /<Match\s*\{/,
          /<Dynamic\s*\{/,
        ],
        features: [
          /createRoot|render/,
          /useTransition|batch/,
          /children\s*\(/,
          /createContext|useContext/,
        ],
      },

      qwik: {
        runtime: [
          /import\s*{\s*[^}]*}\s*from\s*['"]@builder\.io\/qwik['"]/,
          /component\$|useSignal\$/,
          /useStore\$|useResource\$/,
          /useClientEffect\$/,
        ],
        components: [
          /bind:/,
          /on:click/,
          /on:input/,
          // Qwik specific
          /useClientEffect\$/,
          /component\$/,
        ],
        markup: [/<\$>/, /<\/\$>/, /<Slot\s*\/>/, /q:slot/],
        features: [
          /useStore\$/,
          /useSignal\$/,
          /useResource\$/,
          /useLocation\$/,
        ],
      },
      vue: {
        runtime: [
          /__vue__|Vue\$3/,
          /createApp|defineComponent/,
          /v-[a-z-]+?(?:=|>)/,
          /vue\.runtime|vue\.common/,
          /vuex|vue-router/,
        ],
        components: [
          /data-v-[a-f0-9]{8}/,
          /v-[a-z-]+?(?:=|>)/,
          /(?:v-bind|v-on|v-if|v-for|v-else|v-show)/,
          /vue-component-[0-9]+-[0-9]+/,
        ],
        markup: [
          /data-v-app/,
          /<transition|<keep-alive/,
          /v-cloak|v-html/,
          /@click|@change|@input/,
        ],
        features: [
          /computed:|watch:|methods:/,
          /setup\(\)|ref\(|reactive\(/,
          /onMounted|onUnmounted|onUpdated/,
          /defineProps|defineEmits/,
        ],
      },
      nuxt: {
        runtime: [
          /__NUXT__|nuxt\.config/,
          /useNuxt|defineNuxtConfig/,
          /nuxt-link|nuxt-child/,
          /nuxtjs|nuxt3/,
        ],
        components: [
          /nuxt\/app/,
          /nuxt\/components/,
          /NuxtPage|NuxtLayout/,
          /useAsyncData|useFetch/,
        ],
        markup: [
          /data-n-head/,
          /_nuxt\/|-nuxt-/,
          /nuxt-error-/,
          /nuxt-loading/,
        ],
        features: [
          /useRuntimeConfig/,
          /defineNuxtPlugin/,
          /useNuxtApp/,
          /nuxt\.config\./,
        ],
      },
      angular: {
        runtime: [
          /ng(?:Module|Component|Injectable|Directive)/,
          /platformBrowser/,
          /\[\[ɵ[a-z]+?\]\]/,
          /(?:ng|_ng)[A-Z][A-Za-z]+=/,
        ],
        components: [
          /app-root/,
          /\[(?:ng[A-Z][a-zA-Z]+)\]/,
          /\(click\)|\(change\)|\(input\)/,
          /ngModel|ngFor|ngIf/,
        ],
        markup: [
          /ng-version/,
          /ng-reflect/,
          /_nghost|_ngcontent/,
          /ng-star-inserted/,
        ],
        features: [
          /ChangeDetector|NgZone/,
          /HttpClient|FormGroup/,
          /BehaviorSubject|Observable/,
          /NgRx|Effects|Store/,
        ],
      },
      svelte: {
        runtime: [
          /__SVELTE=/,
          /svelte(?:\/internal|\-dev)/,
          /SvelteComponent/,
          /create_(?:component|fragment|slot)/,
        ],
        components: [
          /svelte-[a-zA-Z0-9]+/,
          /(?:bind|on|use|transition):/,
          /\{#(?:if|each|await)\}/,
          /\{:(?:else|then|catch)\}/,
        ],
        markup: [
          /data-svelte/,
          /svelte-(?:template|fragment)/,
          /hydrate(?:Root|Target)/,
          /svelte-mount/,
        ],
        features: [
          /store\.subscribe/,
          /onMount|onDestroy|beforeUpdate/,
          /createEventDispatcher/,
          /slot\{\}/,
        ],
      },
    };

    // Check window objects first
    const globalMarkers = await this.page!.evaluate(() => {
      return {
        // React and React-based
        react: {
          present: !!(
            window.React ||
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
            document.querySelector('[data-reactroot]')
          ),
          version: window.React?.version,
        },

        // Preact
        preact: {
          present: !!(
            window.preact ||
            document.querySelector('[data-preact-root]') ||
            // Preact running in React compatibility mode
            (window.__PREACT_DEVTOOLS__ && window.React)
          ),
          version: window.preact?.version,
        },

        // Solid
        solid: {
          present: !!(
            window.Solid ||
            window._$HY || // Solid's hydratable marker
            document.querySelector('[data-hk]') // Solid resource marker
          ),
          version: window.Solid?.version,
        },

        // Qwik
        qwik: {
          present: !!(
            window.qwik ||
            window.Q ||
            document.querySelector('[q\\:container]') ||
            document.querySelector('[q\\:version]')
          ),
          version: document
            .querySelector('[q\\:version]')
            ?.getAttribute('q:version'),
        },

        // Vue and Nuxt
        vue: {
          present: !!(
            window.Vue ||
            window.__VUE__ ||
            document.querySelector('[data-v-app]') ||
            document.querySelector('[__vue_app__]')
          ),
          version:
            window.Vue?.version ||
            document.querySelector('[data-v-app]')?.getAttribute('version'),
        },

        // Nuxt specific
        nuxt: {
          present: !!(
            window.__NUXT__ ||
            window.$nuxt ||
            document.querySelector('#__nuxt') ||
            document.querySelector('#__nuxt_async')
          ),
          version: window.$nuxt?.$version || window.__NUXT__?.version,
        },

        // Angular
        angular: {
          present: !!(
            window.ng ||
            window.angular ||
            document.querySelector('[ng-version]') ||
            document.querySelector('[ng-app]')
          ),
          version:
            document
              .querySelector('[ng-version]')
              ?.getAttribute('ng-version') || window.angular?.version?.full,
        },

        // Svelte
        svelte: {
          present: !!(
            window.__SVELTE ||
            window.svelte ||
            document.querySelector('[data-svelte]') ||
            document.querySelector('[data-svelte-component]')
          ),
          version: window.svelte?.VERSION,
        },

        // Additional framework information
        // meta: {
        //   // State management
        //   stateManagement: {
        //     redux: !!window.__REDUX_DEVTOOLS_EXTENSION__,
        //     mobx: !!window.__MOBX_DEVTOOLS_GLOBAL_HOOK__,
        //     vuex: !!window.__VUEX__,
        //     pinia: !!window.__PINIA__,
        //     recoil: !!window.__RECOIL_DEVTOOLS_EXTENSION__,
        //     zustand: !!window.__ZUSTAND_DEVTOOLS_EXTENSION__,
        //   },

        //   // Router
        //   routing: {
        //     reactRouter: !!window.__REACT_ROUTER_GLOBAL_HISTORY__,
        //     vueRouter: !!window.__VUE_ROUTER__,
        //     angularRouter: !!window.ng?.getInjector,
        //     svelteRouter: !!window.__SVELTEKIT_ROUTER__,
        //   }
        // }
      };
    });

    const scores: Record<keyof typeof patterns, number> = {
      react: 0,
      preact: 0,
      solid: 0,
      qwik: 0,
      vue: 0,
      nuxt: 0,
      angular: 0,
      svelte: 0,
    };

    if (globalMarkers.react.present) scores.react += 0.4;
    if (globalMarkers.preact.present) scores.preact += 0.4;
    if (globalMarkers.solid.present) scores.solid += 0.4;
    if (globalMarkers.qwik.present) scores.qwik += 0.4;
    if (globalMarkers.vue.present) scores.vue += 0.4;
    if (globalMarkers.nuxt.present) scores.nuxt += 0.4;
    if (globalMarkers.angular.present) scores.angular += 0.4;
    if (globalMarkers.svelte.present) scores.svelte += 0.4;

    // Get all scripts and HTML content
    const allScripts = Array.from(this.resources.getAllScripts()).join('\n');
    const htmlContent = await this.page!.content();
    const allContent = allScripts + htmlContent;

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

    Object.keys(patterns).forEach((bundler) => {
      const bundlerKey = bundler as keyof typeof patterns;
      // Runtime patterns are strong indicators
      checkPatterns(allScripts, bundlerKey, 'runtime', 0.3);
      // Build patterns are strong indicators
      checkPatterns(allScripts, bundlerKey, 'components', 0.25);
      // Build patterns are strong indicators
      checkPatterns(allScripts, bundlerKey, 'markup', 0.2);
      // Module patterns are moderate indicators
      checkPatterns(allScripts, bundlerKey, 'features', 0.1);
    });

    // Calculate scores for each framework

    // Find the framework with highest score
    const [[mainFramework, maxScore]] = Object.entries(scores).sort(
      ([, a], [, b]) => b - a
    );

    // Get version from global detection
    const version =
      globalMarkers[mainFramework as keyof typeof globalMarkers]?.version;

    const libraries = await this.detectLibraries(mainFramework);
    // const meta = await this.detectMeta(mainFramework);

    if (maxScore < 0.3) {
      return {
        name: 'unknown',
        confidence: 0,
        libraries: null,
      };
    }

    return {
      name: mainFramework,
      version,
      confidence: maxScore,
      libraries,
    };
  }

  private async detectLibraries(framework: string): Promise<UILibraries> {
    const stateManagementLibraries = [];
    const routerLibraries = [];

    switch (framework) {
      case 'react':
        if (await this.hasReactRouter()) routerLibraries.push('react-router');
        if (await this.hasRedux()) stateManagementLibraries.push('redux');
        if (await this.hasMobX()) stateManagementLibraries.push('mobx');
        if (await this.hasRecoil()) stateManagementLibraries.push('recoil');
        break;
      case 'vue':
        if (await this.hasVueRouter()) routerLibraries.push('vue-router');
        if (await this.hasVuex()) stateManagementLibraries.push('vuex');
        if (await this.hasPinia()) stateManagementLibraries.push('pinia');
        break;
      case 'angular':
        if (await this.hasAngularRouter())
          routerLibraries.push('angular-router');
        if (await this.hasNgrx()) stateManagementLibraries.push('ngrx');
        if (await this.hasNgxs()) stateManagementLibraries.push('ngxs');
        if (await this.hasAkita()) stateManagementLibraries.push('akita');
        break;
      case 'svelte':
        if (await this.hasSvelteRouter()) {
          routerLibraries.push('svelte-routing');
          if (await this.hasSvelteKit()) {
            routerLibraries.push('sveltekit-router');
          }
        }

        if (await this.hasSvelteStore()) {
          stateManagementLibraries.push('svelte-store');
        }
        if (await this.hasSvelteMobx()) {
          stateManagementLibraries.push('svelte-mobx');
        }
        break;
    }

    return {
      stateManagement: stateManagementLibraries,
      router: routerLibraries,
    };
  }

  private async hasRedux(): Promise<boolean> {
    // Check for Redux in window object
    const hasReduxInWindow = await this.page!.evaluate(() => {
      return !!window.__REDUX_DEVTOOLS_EXTENSION__ || !!window.__REDUX_STATE__;
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

    const hasReduxInScripts = Array.from(this.resources.getAllScripts()).some(
      (script) => reduxPatterns.some((pattern) => script.includes(pattern))
    );

    return hasReduxInWindow || hasReduxInScripts;
  }

  private async hasReactRouter(): Promise<boolean> {
    // Check for React Router in window object
    const hasReactRouterInWindow = await this.page!.evaluate(() => {
      // eslint-disable-next-line
      return !!window.ReactRouter || !!window.__RouterContext || window.__REACT_ROUTER_GLOBAL_HISTORY__;
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

    const hasRouterInScripts = Array.from(this.resources.getAllScripts()).some(
      (script) => routerPatterns.some((pattern) => script.includes(pattern))
    );

    // Check for router-specific DOM elements
    const hasRouterElements = await this.page!.evaluate(() => {
      return (
        !!document.querySelector(
          '[data-reactroot] a[href]:not([href^="http"])'
        ) || !!document.querySelector('nav a[href]:not([href^="http"])')
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

  private async hasMobX(): Promise<boolean> {
    const hasMobxInWindow = await this.page!.evaluate(() => {
      return !!window.__MOBX_DEVTOOLS_GLOBAL_HOOK__;
    });

    const mobxPatterns = [
      'observable',
      'action',
      'computed',
      'makeObservable',
      'makeAutoObservable',
      'observer',
      'useObserver',
    ];

    const hasMobxInScripts = Array.from(this.resources.getAllScripts()).some(
      (script) => mobxPatterns.some((pattern) => script.includes(pattern))
    );

    return hasMobxInWindow || hasMobxInScripts;
  }

  private async hasRecoil(): Promise<boolean> {
    const hasRecoilInWindow = await this.page!.evaluate(() => {
      return !!window.__RECOIL_DEVTOOLS_EXTENSION__;
    });

    const recoilPatterns = [
      'RecoilRoot',
      'atom(',
      'selector(',
      'useRecoilState',
      'useRecoilValue',
      'useSetRecoilState',
    ];

    const hasRecoilInScripts = Array.from(this.resources.getAllScripts()).some(
      (script) => recoilPatterns.some((pattern) => script.includes(pattern))
    );

    return hasRecoilInWindow || hasRecoilInScripts;
  }

  private async hasZustand(): Promise<boolean> {
    const zustandPatterns = [
      'create((set, get)',
      'zustand/vanilla',
      'useStore(',
      'shallow',
    ];

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
    const hasPiniaInWindow = await this.page!.evaluate(() => {
      return !!window.window.__PINIA__;
    });

    const piniaPatterns = [
      'createPinia',
      'defineStore',
      'storeToRefs',
      'usePinia',
    ];

    const hasPinitInScripts = Array.from(this.resources.getAllScripts()).some(
      (script) => piniaPatterns.some((pattern) => script.includes(pattern))
    );

    return hasPiniaInWindow || hasPinitInScripts;
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
    const ngxsPatterns = [
      '@State',
      '@Action',
      '@Selector',
      'Store.select',
      'StateOperator',
    ];

    return Array.from(this.resources.getAllScripts()).some((script) =>
      ngxsPatterns.some((pattern) => script.includes(pattern))
    );
  }

  private async hasAkita(): Promise<boolean> {
    const akitaPatterns = [
      'QueryEntity',
      'StoreConfig',
      'EntityStore',
      'EntityState',
      'akita',
    ];

    return Array.from(this.resources.getAllScripts()).some((script) =>
      akitaPatterns.some((pattern) => script.includes(pattern))
    );
  }

  private async hasAngularRouter(): Promise<boolean> {
    const hasAngularRouterInWindow = await this.page!.evaluate(() => {
      return !!window.ng?.getInjector;
    });

    const routerPatterns = [
      'RouterModule',
      'ActivatedRoute',
      'Router',
      'routerLink',
      'router-outlet',
    ];

    const hasAngularRouterInScripts = Array.from(
      this.resources.getAllScripts()
    ).some((script) =>
      routerPatterns.some((pattern) => script.includes(pattern))
    );

    return hasAngularRouterInWindow || hasAngularRouterInScripts;
  }

  private async hasSvelteRouter(): Promise<boolean> {
    const routerPatterns = [
      /Router|Link|navigate/,
      /svelte-routing/,
      /\$page/,
      /goto\(/,
    ];

    const hasSvelteRouterInScripts = Array.from(
      this.resources.getAllScripts()
    ).some((script) => routerPatterns.some((pattern) => pattern.test(script)));

    return hasSvelteRouterInScripts;
  }

  private async hasSvelteKit(): Promise<boolean> {
    const patterns = [
      /\$app\/navigation/,
      /\$app\/stores/,
      /__SVELTEKIT_APP__/,
      /load\(\{\s*fetch\s*\}/,
    ];

    const hasSvelteKitInScripts = Array.from(
      this.resources.getAllScripts()
    ).some((script) => patterns.some((pattern) => pattern.test(script)));

    return hasSvelteKitInScripts;
  }

  private async hasSvelteStore(): Promise<boolean> {
    const patterns = [
      /writable|readable|derived/,
      /\$store/,
      /import\s*{\s*[^}]*}\s*from\s*['"]svelte\/store['"]/,
      /store\.subscribe/,
    ];

    const svelteStoreInScripts = Array.from(
      this.resources.getAllScripts()
    ).some((script) => patterns.some((pattern) => pattern.test(script)));

    return svelteStoreInScripts;
  }

  private async hasSvelteMobx(): Promise<boolean> {
    const patterns = [/svelte-mobx/, /useMobxStore/, /observer\(/];
    const svelteMobxInScripts = Array.from(this.resources.getAllScripts()).some(
      (script) => patterns.some((pattern) => pattern.test(script))
    );

    return svelteMobxInScripts;
  }

  private async detectSSR(framework: string): Promise<boolean> {
    // First check framework-specific SSR markers
    const librarySSR = await this.detectLibrarySpecificSSR(framework);
    if (librarySSR !== null) {
      return librarySSR;
    }

    // If framework-specific detection is inconclusive, try general SSR detection
    return this.detectGeneralSSR();
  }

  private async detectLibrarySpecificSSR(
    framework: string
  ): Promise<boolean | null> {
    switch (framework) {
      case 'react':
        return this.detectReactSSR();
      case 'vue':
        return this.detectVueSSR();
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
        hasHydrationComment:
          document.documentElement.innerHTML.includes('<!--$-->'),

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
        hasHydrationMarker:
          document.documentElement.innerHTML.includes('<!--[-->'),

        // Check for server-rendered content
        hasInitialContent:
          document.body.children.length > 0 &&
          !document.querySelector('[id="app"]')?.children.length,
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
        hasPlatformServer:
          document.documentElement.hasAttribute('ng-server-context'),

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
      hasContentWithoutJs:
        noJsHtml.length > 1000 && noJsHtml.includes('</div>'),

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
      hasStaticMarkers:
        initialHtml.includes('static-page') ||
        initialHtml.includes('prerender'),

      // Compare content with and without JS
      hasSimilarContent: calculateSimilarity(initialHtml, noJsHtml) > 0.7,

      // Check for meta tags that are typically server-rendered
      hasServerRenderedMeta:
        initialHtml.includes('og:') && initialHtml.includes('twitter:'),

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

  // private async hasStyleComponents(): Promise<boolean> {
  //   // Check for styled-components class patterns
  //   const hasStyledClasses = await this.page!.evaluate(() => {
  //     return Array.from(document.querySelectorAll('*')).some((el) =>
  //       Array.from(el.classList).some((cls) => /^sc-[a-zA-Z0-9]/.test(cls))
  //     );
  //   });

  //   // Check for styled-components patterns in scripts
  //   const styledPatterns = ['styled.', 'createGlobalStyle', 'css`', 'withTheme', 'ThemeProvider'];

  //   const hasStyledInScripts = Array.from(this.resources.getAllScripts()).some((script) =>
  //     styledPatterns.some((pattern) => script.includes(pattern))
  //   );

  //   return hasStyledClasses || hasStyledInScripts;
  // }

  private async hasVueRouter(): Promise<boolean> {
    // Check for Vue Router in window object
    const hasVueRouterInWindow = await this.page!.evaluate(() => {
      return !!window.VueRouter || !!window.$router || window.__VUE_ROUTER__;
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

    const hasVueRouterInScripts = Array.from(
      this.resources.getAllScripts()
    ).some((script) =>
      routerPatterns.some((pattern) => script.includes(pattern))
    );

    return hasVueRouterInWindow || hasVueRouterInScripts;
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

    const hasVuexInScripts = Array.from(this.resources.getAllScripts()).some(
      (script) => vuexPatterns.some((pattern) => script.includes(pattern))
    );

    return hasVuexInWindow || hasVuexInScripts;
  }
}
