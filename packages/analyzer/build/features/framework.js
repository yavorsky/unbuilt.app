var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { calculateSimilarity } from '../utils.js';
export class FrameworkFeaturesDetector {
    constructor(page, resources, browser) {
        this.page = page;
        this.resources = resources;
        this.browser = browser;
    }
    detect() {
        return __awaiter(this, void 0, void 0, function* () {
            const patterns = {
                react: {
                    runtime: [
                        /(?:React|react)\.(?:createElement|Component|Fragment|useState|useEffect|memo)/,
                        /__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED/,
                        /\$\$typeof|Symbol\.for\("react\.element"\)/,
                        /_jsx|_jsxs|_jsxDEV/,
                        /react-dom/,
                    ],
                    components: [/className=/, /onClick=/, /onChange=/, /data-reactroot/, /[rR]eact\.lazy\(/],
                    markup: [
                        /<\/?[A-Z][A-Za-z0-9]*>/, // React component naming convention
                        /<!--\$-->|<!--\$!-->/, // React 18 streaming markers
                        /data-reactid/,
                        /hydrate(?:Root)?/,
                    ],
                    features: [
                        /useCallback|useMemo|useContext|useReducer|useRef/,
                        /Suspense|StrictMode|Fragment|Portal/,
                        /createPortal|flushSync|startTransition/,
                    ],
                },
                next: {
                    runtime: [
                        /__NEXT_DATA__/,
                        /__NEXT_LOADED_PAGES__/,
                        /__next_app|__next_init/,
                        /next\/router|next\/link/,
                        /_app|_document|_error/,
                    ],
                    components: [/next\/image/, /next\/script/, /next\/head/, /next\/dynamic/],
                    markup: [/data-nextjs/, /next-route-announcer/, /next-page/, /__next-css/],
                    features: [
                        /getStaticProps|getServerSideProps/,
                        /getInitialProps/,
                        /useRouter|withRouter/,
                        /_middleware/,
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
                    markup: [/data-n-head/, /_nuxt\/|-nuxt-/, /nuxt-error-/, /nuxt-loading/],
                    features: [/useRuntimeConfig/, /defineNuxtPlugin/, /useNuxtApp/, /nuxt\.config\./],
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
                    markup: [/ng-version/, /ng-reflect/, /_nghost|_ngcontent/, /ng-star-inserted/],
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
            const globalDetection = yield this.page.evaluate(() => {
                var _a, _b, _c, _d, _e;
                return {
                    react: {
                        present: !!window.React,
                        version: (_a = window.React) === null || _a === void 0 ? void 0 : _a.version,
                    },
                    vue: {
                        present: !!(window.__VUE__ || window.Vue),
                        version: (_b = window.Vue) === null || _b === void 0 ? void 0 : _b.version,
                    },
                    angular: {
                        present: !!window.ng,
                        version: (_c = document.querySelector('[ng-version]')) === null || _c === void 0 ? void 0 : _c.getAttribute('ng-version'),
                    },
                    next: {
                        present: !!window.__NEXT_DATA__,
                        version: (_d = window.__NEXT_DATA__) === null || _d === void 0 ? void 0 : _d.buildId,
                    },
                    nuxt: {
                        present: !!window.__NUXT__,
                        version: (_e = window.$nuxt) === null || _e === void 0 ? void 0 : _e.$version,
                    },
                    svelte: {
                        present: !!window.__SVELTE,
                        version: null, // Svelte doesn't expose version globally
                    },
                };
            });
            // Score calculation based on pattern matches
            const calculateScore = (content, frameworkPatterns) => {
                let score = 0;
                // Runtime patterns are strongest indicators
                frameworkPatterns.runtime.forEach((pattern) => {
                    if (pattern.test(content))
                        score += 0.3;
                });
                // Component patterns are good indicators
                frameworkPatterns.components.forEach((pattern) => {
                    if (pattern.test(content))
                        score += 0.2;
                });
                // Markup patterns are good indicators
                frameworkPatterns.markup.forEach((pattern) => {
                    if (pattern.test(content))
                        score += 0.2;
                });
                // Feature patterns are supporting indicators
                frameworkPatterns.features.forEach((pattern) => {
                    if (pattern.test(content))
                        score += 0.1;
                });
                return Math.min(score, 1); // Normalize to 0-1
            };
            // Get all scripts and HTML content
            const allScripts = Array.from(this.resources.getAllScripts()).join('\n');
            const htmlContent = yield this.page.content();
            const allContent = allScripts + htmlContent;
            // Calculate scores for each framework
            const scores = Object.entries(patterns).reduce((acc, [framework, frameworkPatterns]) => {
                const score = calculateScore(allContent, frameworkPatterns);
                // Add bonus for global detection
                if (globalDetection[framework].present) {
                    acc[framework] = Math.min(score + 0.3, 1);
                }
                else {
                    acc[framework] = score;
                }
                return acc;
            }, {});
            // Find the framework with highest score
            const [[mainFramework, maxScore]] = Object.entries(scores).sort(([, a], [, b]) => b - a);
            // Get version from global detection
            const version = globalDetection[mainFramework].version;
            const features = yield this.detectFrameworkFeatures(mainFramework);
            const meta = yield this.detectFrameworkMeta(mainFramework);
            return {
                name: mainFramework,
                version,
                confidence: maxScore,
                features,
                meta: Object.assign(Object.assign({}, meta), { isSSR: yield this.detectSSR(mainFramework), hasRouter: features.includes('router'), hasStateManagement: features.includes('state-management') }),
            };
        });
    }
    detectFrameworkFeatures(framework) {
        return __awaiter(this, void 0, void 0, function* () {
            const features = [];
            switch (framework) {
                case 'react':
                    if (yield this.hasReactRouter())
                        features.push('router');
                    if (yield this.hasRedux())
                        features.push('redux');
                    if (yield this.hasStyleComponents())
                        features.push('styled-components');
                    break;
                case 'vue':
                    if (yield this.hasVueRouter())
                        features.push('vue-router');
                    if (yield this.hasVuex())
                        features.push('vuex');
                    if (yield this.hasNuxt())
                        features.push('nuxt');
                    break;
                // Add more framework-specific feature detection
            }
            return features;
        });
    }
    hasRedux() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for Redux in window object
            const hasReduxInWindow = yield this.page.evaluate(() => {
                // eslint-disable-next-line
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
            const hasReduxInScripts = Array.from(this.resources.getAllScripts()).some((script) => reduxPatterns.some((pattern) => script.includes(pattern)));
            return hasReduxInWindow || hasReduxInScripts;
        });
    }
    hasReactRouter() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for React Router in window object
            const hasReactRouterInWindow = yield this.page.evaluate(() => {
                // eslint-disable-next-line
                return !!window.ReactRouter || !!window.__RouterContext;
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
            const hasRouterInScripts = Array.from(this.resources.getAllScripts()).some((script) => routerPatterns.some((pattern) => script.includes(pattern)));
            // Check for router-specific DOM elements
            const hasRouterElements = yield this.page.evaluate(() => {
                return (!!document.querySelector('[data-reactroot] a[href]:not([href^="http"])') ||
                    !!document.querySelector('nav a[href]:not([href^="http"])'));
            });
            return hasReactRouterInWindow || hasRouterInScripts || hasRouterElements;
        });
    }
    detectFrameworkMeta(framework) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                isSSR: yield this.detectSSR(framework),
                hasRouter: yield this.hasRouting(framework),
                hasStateManagement: yield this.hasStateManagement(framework),
            };
        });
    }
    hasRouting(framework) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    hasStateManagement(framework) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    hasReactStateManagement() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for various React state management solutions
            const hasRedux = yield this.hasRedux();
            const hasMobx = yield this.hasMobX();
            const hasRecoil = yield this.hasRecoil();
            const hasZustand = yield this.hasZustand();
            return hasRedux || hasMobx || hasRecoil || hasZustand;
        });
    }
    hasMobX() {
        return __awaiter(this, void 0, void 0, function* () {
            const mobxPatterns = [
                'observable',
                'action',
                'computed',
                'makeObservable',
                'makeAutoObservable',
                'observer',
                'useObserver',
            ];
            return Array.from(this.resources.getAllScripts()).some((script) => mobxPatterns.some((pattern) => script.includes(pattern)));
        });
    }
    hasRecoil() {
        return __awaiter(this, void 0, void 0, function* () {
            const recoilPatterns = [
                'RecoilRoot',
                'atom(',
                'selector(',
                'useRecoilState',
                'useRecoilValue',
                'useSetRecoilState',
            ];
            return Array.from(this.resources.getAllScripts()).some((script) => recoilPatterns.some((pattern) => script.includes(pattern)));
        });
    }
    hasZustand() {
        return __awaiter(this, void 0, void 0, function* () {
            const zustandPatterns = ['create((set, get)', 'zustand/vanilla', 'useStore(', 'shallow'];
            return Array.from(this.resources.getAllScripts()).some((script) => zustandPatterns.some((pattern) => script.includes(pattern)));
        });
    }
    hasVueStateManagement() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for various Vue state management solutions
            const hasVuex = yield this.hasVuex();
            const hasPinia = yield this.hasPinia();
            return hasVuex || hasPinia;
        });
    }
    hasPinia() {
        return __awaiter(this, void 0, void 0, function* () {
            const piniaPatterns = ['createPinia', 'defineStore', 'storeToRefs', 'usePinia'];
            return Array.from(this.resources.getAllScripts()).some((script) => piniaPatterns.some((pattern) => script.includes(pattern)));
        });
    }
    hasAngularStateManagement() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for various Angular state management solutions
            const hasNgrx = yield this.hasNgrx();
            const hasNgxs = yield this.hasNgxs();
            const hasAkita = yield this.hasAkita();
            return hasNgrx || hasNgxs || hasAkita;
        });
    }
    hasNgrx() {
        return __awaiter(this, void 0, void 0, function* () {
            const ngrxPatterns = [
                'StoreModule',
                'createAction',
                'createReducer',
                'createEffect',
                'createSelector',
            ];
            return Array.from(this.resources.getAllScripts()).some((script) => ngrxPatterns.some((pattern) => script.includes(pattern)));
        });
    }
    hasNgxs() {
        return __awaiter(this, void 0, void 0, function* () {
            const ngxsPatterns = ['@State', '@Action', '@Selector', 'Store.select', 'StateOperator'];
            return Array.from(this.resources.getAllScripts()).some((script) => ngxsPatterns.some((pattern) => script.includes(pattern)));
        });
    }
    hasAkita() {
        return __awaiter(this, void 0, void 0, function* () {
            const akitaPatterns = ['QueryEntity', 'StoreConfig', 'EntityStore', 'EntityState', 'akita'];
            return Array.from(this.resources.getAllScripts()).some((script) => akitaPatterns.some((pattern) => script.includes(pattern)));
        });
    }
    hasAngularRouter() {
        return __awaiter(this, void 0, void 0, function* () {
            const routerPatterns = [
                'RouterModule',
                'ActivatedRoute',
                'Router',
                'routerLink',
                'router-outlet',
            ];
            return Array.from(this.resources.getAllScripts()).some((script) => routerPatterns.some((pattern) => script.includes(pattern)));
        });
    }
    detectSSR(framework) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check framework-specific SSR markers
            const frameworkSSR = yield this.detectFrameworkSpecificSSR(framework);
            if (frameworkSSR !== null) {
                return frameworkSSR;
            }
            // If framework-specific detection is inconclusive, try general SSR detection
            return this.detectGeneralSSR();
        });
    }
    detectFrameworkSpecificSSR(framework) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    detectReactSSR() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for React SSR markers
            return this.page.evaluate(() => {
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
        });
    }
    detectVueSSR() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.evaluate(() => {
                var _a;
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
                    hasInitialContent: document.body.children.length > 0 &&
                        !((_a = document.querySelector('[id="app"]')) === null || _a === void 0 ? void 0 : _a.children.length),
                };
                return Object.values(markers).some(Boolean);
            });
        });
    }
    detectNextSSR() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.evaluate(() => {
                var _a, _b;
                const markers = {
                    // Next.js data object
                    hasNextData: !!window.__NEXT_DATA__,
                    // Next.js specific props
                    hasPageProps: document.querySelector('[data-nextjs-page]') !== null,
                    // Static optimization indicator
                    hasStaticOptimization: !!((_a = window.__NEXT_DATA__) === null || _a === void 0 ? void 0 : _a.autoExport),
                    // Server-side generated styles
                    hasSSRStyles: !!document.querySelector('style[data-n-href]'),
                    // Check for specific Next.js attributes
                    hasNextAttributes: (_b = document
                        .querySelector('[data-reactroot]')) === null || _b === void 0 ? void 0 : _b.hasAttribute('data-nextjs-page'),
                };
                return Object.values(markers).some(Boolean);
            });
        });
    }
    detectNuxtSSR() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.evaluate(() => {
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
        });
    }
    detectAngularSSR() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.evaluate(() => {
                var _a;
                const root = document.querySelector('app-root');
                const markers = {
                    // Angular Universal markers
                    hasUniversalState: !!window.UNIVERSAL_STATE,
                    // Transfer state marker
                    hasTransferState: !!document.querySelector('#_TRANSFER_STATE'),
                    // Platform server marker
                    hasPlatformServer: document.documentElement.hasAttribute('ng-server-context'),
                    // Check for prerendered content
                    hasPrerenderedContent: root && ((_a = root === null || root === void 0 ? void 0 : root.children) === null || _a === void 0 ? void 0 : _a.length) > 0,
                };
                return Object.values(markers).some(Boolean);
            });
        });
    }
    detectGeneralSSR() {
        return __awaiter(this, void 0, void 0, function* () {
            // Collect multiple signals for SSR detection
            const signals = yield this.collectSSRSignals();
            // Weight and score the signals
            return this.evaluateSSRSignals(signals);
        });
    }
    collectSSRSignals() {
        return __awaiter(this, void 0, void 0, function* () {
            // First request - check initial HTML
            const initialResponse = yield this.page.goto(this.page.url(), {
                waitUntil: 'domcontentloaded',
            });
            const initialHtml = (yield (initialResponse === null || initialResponse === void 0 ? void 0 : initialResponse.text())) || '';
            // Second request - with JS disabled
            const context = yield this.browser.newContext({
                javaScriptEnabled: false,
            });
            const noJsPage = yield context.newPage();
            const noJsResponse = yield noJsPage.goto(this.page.url());
            const noJsHtml = (yield (noJsResponse === null || noJsResponse === void 0 ? void 0 : noJsResponse.text())) || '';
            // Clean up
            yield context.close();
            // Compare and collect signals
            return {
                // Check if meaningful content is present without JS
                hasContentWithoutJs: noJsHtml.length > 1000 && noJsHtml.includes('</div>'),
                // Check for common SSR markers
                hasCommonSSRMarkers: initialHtml.includes('data-server-rendered') ||
                    initialHtml.includes('data-reactroot') ||
                    initialHtml.includes('data-nextjs-page') ||
                    initialHtml.includes('data-n-head="ssr"'),
                // Check for hydration markers
                hasHydrationMarkers: initialHtml.includes('<!--$-->') ||
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
        });
    }
    evaluateSSRSignals(signals) {
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
            return total + (present ? weights[signal] : 0);
        }, 0);
        // Return true if score exceeds threshold
        return score > 0.5;
    }
    hasStyleComponents() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for styled-components class patterns
            const hasStyledClasses = yield this.page.evaluate(() => {
                return Array.from(document.querySelectorAll('*')).some((el) => Array.from(el.classList).some((cls) => /^sc-[a-zA-Z0-9]/.test(cls)));
            });
            // Check for styled-components patterns in scripts
            const styledPatterns = ['styled.', 'createGlobalStyle', 'css`', 'withTheme', 'ThemeProvider'];
            const hasStyledInScripts = Array.from(this.resources.getAllScripts()).some((script) => styledPatterns.some((pattern) => script.includes(pattern)));
            return hasStyledClasses || hasStyledInScripts;
        });
    }
    hasVueRouter() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for Vue Router in window object
            const hasVueRouterInWindow = yield this.page.evaluate(() => {
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
            const hasRouterInScripts = Array.from(this.resources.getAllScripts()).some((script) => routerPatterns.some((pattern) => script.includes(pattern)));
            return hasVueRouterInWindow || hasRouterInScripts;
        });
    }
    hasVuex() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for Vuex in window object
            const hasVuexInWindow = yield this.page.evaluate(() => {
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
            const hasVuexInScripts = Array.from(this.resources.getAllScripts()).some((script) => vuexPatterns.some((pattern) => script.includes(pattern)));
            return hasVuexInWindow || hasVuexInScripts;
        });
    }
    hasNuxt() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for Nuxt in window object
            const hasNuxtInWindow = yield this.page.evaluate(() => {
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
            const hasNuxtInScripts = Array.from(this.resources.getAllScripts()).some((script) => nuxtPatterns.some((pattern) => script.includes(pattern)));
            // Check for Nuxt-specific meta tags
            const hasNuxtMeta = yield this.page.evaluate(() => {
                return (!!document.querySelector('script[data-n-head="ssr"]') ||
                    !!document.querySelector('meta[data-n-head="ssr"]'));
            });
            return hasNuxtInWindow || hasNuxtInScripts || hasNuxtMeta;
        });
    }
}
//# sourceMappingURL=framework.js.map