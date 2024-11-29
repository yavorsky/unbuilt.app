import { Pattern } from "../../../types.js";

export const nuxt = [
  {
    score: 0.3,
    name: 'Runtime patterns',
    runtime: [
      // Core Nuxt patterns
      /__NUXT__|nuxt\.config/,
      /useNuxt|defineNuxtConfig/,
      /nuxt-link|nuxt-child/,
      /nuxtjs|nuxt3/,
      // Nuxt 3 specifics
      /useNuxtApp/,
      /defineNuxtPlugin/,
    ]
  },
  {
    score: 0.3,
    name: 'Components',
    runtime: [
      // Built-in components
      /nuxt\/app/,
      /nuxt\/components/,
      /NuxtPage|NuxtLayout/,
      /NuxtLink|NuxtChild/,
      // Data fetching
      /useAsyncData|useFetch/,
      /useLazyFetch|useLazyAsyncData/,
    ]
  },
  {
    score: 0.2,
    name: 'Markup patterns',
    runtime: [
      /data-n-head/,
      /_nuxt\/|-nuxt-/,
      /nuxt-error/,
      /nuxt-loading/,
      // Nuxt specific classes
      /nuxt-link-active/,
      /nuxt-link-exact-active/,
    ]
  },
  {
    score: 0.2,
    name: 'Internal Features',
    runtime: [
      // Configuration
      /useRuntimeConfig/,
      /defineNuxtPlugin/,
      /useNuxtApp/,
      /nuxt\.config\./,
      // Composables
      /useHead|useSeoMeta/,
      /useRoute|useRouter/,
    ]
  },
  {
    score: 0.2,
    name: 'Build information',
    runtime: [
      // Build output
      /\.nuxt\//,
      /\.output\//,
      /nuxt\.config\./,
      // Build features
      /buildModules/,
      /transpile/,
      /nitro/,
    ]
  },
  {
    score: 0.2,
    name: 'Routing patterns',
    runtime: [
      // File-based routing
      /\[\.{3}\w+\]/, // catch-all routes
      /\[\w+\]/, // dynamic routes
      // Navigation
      /navigateTo/,
      /abortNavigation/,
    ]
  },
  {
    score: 0.2,
    name: 'Server-side rendering',
    runtime: [
      // State management
      /useState/,
      /useAsyncData/,
      /useFetch/,
      /useLazyFetch/,
      // Server utilities
      /useRequestHeaders/,
      /useRequestEvent/,
    ]
  },
  {
    score: 0.2,
    name: 'Server-side rendering',
    runtime: [
      // SSR specific
      /renderMeta/,
      /process\.server/,
      /process\.client/,
      /onServerPrefetch/,
    ]
  },
];