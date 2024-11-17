/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window extends (Window & typeof globalThis) {
    // Vue
    __VUE__: any;
    __vite__mapDeps: any;
    __vite__base: any;
    __vite__import: any;
    __SVELTE: any;
    __NUXT_PREPATHS__: any;
    angular: any;
    svelte: any;
    __MOBX_DEVTOOLS_GLOBAL_HOOK__: any;
    __VUEX__: any;
    __PINIA__: any;
    __RECOIL_DEVTOOLS_EXTENSION__: any;
    __ZUSTAND_DEVTOOLS_EXTENSION__: any;
    __REACT_ROUTER_GLOBAL_HISTORY__: any;
    __VUE_ROUTER__: any;
    __SVELTEKIT_ROUTER__: any;
    preact: any;
    __PREACT_DEVTOOLS__: any;
    __MOBX_DEVTOOLS_GLOBAL_HOOK__: any;
    qwik: any;
    Q: any;
    _$HY: any;
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
    Solid: any;
    Vue: {
      version: string;
      extend: (options: any) => any;
      nextTick: (fn: () => void) => void;
      set: (target: object, key: string, value: any) => void;
    };
    VueRouter: any;
    $router: any;
    Vuex: any;
    $store: any;

    // React
    React: {
      version: string;
      // eslint-disable-next-line
      createElement: Function;
      Component: any;
      lazy: any;
      Suspense: any;
    };
    ReactRouter: any;
    __RouterContext: any;
    __REDUX_DEVTOOLS_EXTENSION__: any;
    __REDUX_STATE__: any;
    __REACT_ERROR_OVERLAY__: any;

    // Next.js
    __NEXT_DATA__: {
      props: {
        pageProps: Record<string, unknown>;
        [key: string]: unknown;
      };
      page: string;
      query: Record<string, string>;
      buildId: string;
      assetPrefix: string;
      runtimeConfig: Record<string, unknown>;
      nextExport: boolean;
      autoExport: boolean;
      isFallback: boolean;
      dynamicIds: string[];
      err?: Error & {
        statusCode?: number;
      };
    };

    // Nuxt.js
    __NUXT__: {
      layout: string;
      data: any[];
      error: any;
      state: any;
      serverRendered: boolean;
      staticGenerations: any;
      version?: string;
    };
    $nuxt: any;

    // Angular
    ng: any;
    UNIVERSAL_STATE: any;

    // State Management
    __RECOIL_STATE__: any;
    __MOBX_STATE__: any;
    __ZUSTAND_STATE__: any;

    // Framework Detection
    ___gatsby: any;

    // Performance and Debugging
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;

    // SSR & Hydration
    PRELOADED_STATE: any;
    __SSR_STATE__: any;
    __SSR_HYDRATION__: any;
  }
}

// Export empty object to make it a module
export {};