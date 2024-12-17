import { Page } from 'playwright';

export const nuxt = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Nuxt core and runtime
      /\/__nuxt\//,
      /__NUXT__|__nuxt/,
      /nuxt\.config\./,
      /\.nuxt\//,
      // Nuxt app markers
      /\$nuxt\./,
      /window\.\$nuxt/,
      /#nuxt/,
      // Nuxt specific imports
      /from\s+["']#imports["']/,
      /from\s+["']~~["']/,
      /from\s+["']@nuxt\/["']/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.25,
    runtime: [
      // Nuxt components
      /NuxtPage/,
      /NuxtLayout/,
      /NuxtLink/,
      /NuxtLoadingIndicator/,
      // Auto imports
      /defineNuxtComponent/,
      /useNuxtApp/,
      /useRuntimeConfig/,
      // Pages and layouts
      /definePageMeta/,
      /defineNuxtRouteMiddleware/,
    ],
  },
  {
    name: 'composables' as const,
    score: 0.25,
    runtime: [
      // Data fetching
      /useFetch|useAsyncData/,
      /useLazyFetch|useLazyAsyncData/,
      /useNuxtData/,
      // State management
      /useState|useStore/,
      // Navigation
      /navigateTo|abortNavigation/,
      /useRouter|useRoute/,
      // Server
      /useRequestHeaders/,
      /useRequestEvent/,
    ],
  },
  {
    name: 'plugins' as const,
    score: 0.2,
    runtime: [
      // Plugin system
      /defineNuxtPlugin/,
      /plugins\/.*\.[tj]s/,
      // Common plugins
      /nuxt\/image/,
      /nuxt\/content/,
      /nuxt\/auth/,
      /nuxt\/i18n/,
      // Plugin markers
      /app\.config\./,
      /app\.hook\(/,
    ],
  },
  {
    name: 'server' as const,
    score: 0.15,
    runtime: [
      // Server routes and handlers
      /defineEventHandler/,
      /defineNitroPlugin/,
      /server\/api/,
      /server\/routes/,
      /server\/middleware/,
      // Server utilities
      /useRequestHeaders/,
      /useRequestEvent/,
      /useCookie/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Nuxt global
          hasNuxtGlobal: typeof window.__NUXT__ !== 'undefined',
          // Check for Nuxt app instance
          hasNuxtApp: !!window?.$nuxt,
          // Check for Nuxt payload
          hasNuxtPayload: !!document.getElementById('__NUXT_DATA__'),
          // Check for Nuxt loading
          hasNuxtLoading: !!document.getElementById('nuxt-loading'),
          // Check for Nuxt layout
          hasNuxtLayout:
            !!document.getElementById('__nuxt') ||
            !!document.getElementById('__layout'),
          // Check for auto-imports
          hasAutoImports: typeof window?.__nuxt_component_0 !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
