import { Page } from 'playwright';

export const vue = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Vue global and runtime
      /Vue\s*\.\s*createApp/,
      /new\s+Vue\s*\(/,
      /__vue__/,
      /vue\/dist/,
      // Vue runtime markers
      /__v_/,
      /\$vue/,
      /\$nuxt/,
      // Vue 3 specific
      /\bvue3\b/,
      /\[@vue\//,
      // Common minified patterns
      /_vm\.|_v\$/,
      /__VUE_/,
    ]
  },
  {
    name: 'rendering' as const,
    score: 0.3,
    runtime: [
      // Core directives
      /v-if|v-show|v-for/,
      /v-model|v-bind|v-on/,
      /v-html|v-text|v-pre/,
      // Rendering system
      /\$mount|\$nextTick/,
      /\$refs|\$el|\$slots/,
      /\$emit|\$on|\$off/,
      // Vue 3 Fragments
      /Teleport|Suspense/,
      /KeepAlive/,
    ]
  },
  {
    name: 'reactivity' as const,
    score: 0.25,
    runtime: [
      // Vue 2 reactivity
      /\$data|\$props/,
      /\$watch|\$set|\$delete/,
      // Vue 3 composition API
      /ref\s*\(|reactive\s*\(/,
      /computed\s*\(|watch\s*\(/,
      /onMounted|onUnmounted/,
      /provide\s*\(|inject\s*\(/,
      /defineProps|defineEmits/,
      /withDefaults\s*\(/,
    ]
  },
  {
    name: 'components' as const,
    score: 0.25,
    runtime: [
      // Component definition
      /Vue\.component\s*\(/,
      /defineComponent\s*\(/,
      /createApp\s*\(/,
      // Template compilation
      /render\s*:|\$createElement/,
      /template\s*:/,
      // SFC markers
      /\.vue["']/,
      /script\s+setup\b/,
    ]
  },
  {
    name: 'routing' as const,
    score: 0.15,
    runtime: [
      // Vue Router
      /createRouter|useRouter/,
      /RouterView|RouterLink/,
      /\$router|\$route/,
      // Route patterns
      /beforeRouteEnter/,
      /beforeRouteLeave/,
      /router-link/,
      /router-view/,
    ]
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Vue global
          hasVueGlobal: typeof (window as any).Vue !== 'undefined',
          // Check for Vue devtools
          hasDevTools: !!(window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__,
          // Check for Vue instance
          hasVueInstance: !!document.querySelector('[data-v-]'),
          // Check for Vue 3 app container
          hasVue3Container: !!document.querySelector('[__vue_app__]'),
          // Check for Vuex state
          hasVuex: !!(window as any).__VUEX__,
          // Check for common Vue directives
          hasDirectives: !!document.querySelector('[v-show],[v-if],[v-for]'),
          // Check for Vue router
          hasRouter: !!(window as any).__VUE_ROUTER_GLOBAL_HOOK__,
        };
        return Object.values(markers).some(Boolean);
      });
    }
  }
];