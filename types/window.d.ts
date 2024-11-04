/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    // React
    React: {
      version: string;
    };
    ReactRouter: any;
    __RouterContext: any;
    __REDUX_DEVTOOLS_EXTENSION__: any;
    __REDUX_STATE__: any;
    __REACT_ERROR_OVERLAY__: any;

    // Vue
    Vue: {
      version: string;
    };
    __VUE__: any;
    VueRouter: any;
    $router: any;
    Vuex: any;
    $store: any;

    // Next.js
    __NEXT_DATA__: {
      props: any;
      page: string;
      query: any;
      buildId: string;
      assetPrefix: string;
      runtimeConfig: any;
      nextExport: boolean;
      autoExport: boolean;
      isFallback: boolean;
      dynamicIds: string[];
      err: any;
      gsp: boolean;
      gssp: boolean;
      customServer: boolean;
      gip: boolean;
      appGip: boolean;
    };

    // Nuxt.js
    __NUXT__: {
      layout: string;
      data: any[];
      error: any;
      state: any;
      serverRendered: boolean;
      staticGenerations: any;
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
    performance: Performance;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;

    // SSR & Hydration
    PRELOADED_STATE: any;
    __SSR_STATE__: any;
    __SSR_HYDRATION__: any;
  }
}
