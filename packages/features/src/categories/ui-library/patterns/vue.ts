import { Page } from 'playwright';

export const vue = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Vue 3 app initialization (production)
      /const\s+[_$a-zA-Z][\w$]*\s*=\s*createApp\s*\(\s*\{[^}]*\}\s*\)/,

      // Vue 2 initialization (minified)
      /new Vue\(\{(?:[^{}]|{[^{}]*})*el:["'][^"']+["']/,

      // Vue internal properties (minification-resistant)
      /__v_isRef=!0/,
      /__v_isReactive=!0/,
      /__v_raw/,

      // Vue runtime markers (production)
      /\["__file"\]=["'][^"']+\.vue["']/,
      /\$options\._componentTag=/,

      // Vue 3 compiler output
      /\[\$\$\]/, // props destructure
      /\$setup=/, // setup function reference
      /\$props,\$setup,\$data,\$options/, // instance properties
    ],
  },
  {
    name: 'rendering' as const,
    score: 0.3,
    scripts: [
      // Vue render functions (production)
      /_createVNode\(\s*(?:["'][^"']+["']|\w+)\s*,\s*(?:null|\{[^}]*\}|\[[^\]]*\])/,
      /createBlock\(\s*[\w$]+\s*,\s*(?:null|\{[^}]*\}|\[[^\]]*\])/,

      // Vue 3 render markers (minified)
      /openBlock\(\),createElementBlock\(/,
      /createBaseVNode\(\s*["'][^"']+["']/,

      // Vue directive handling (production)
      /withDirectives\(\s*createVNode\(/,
      /vShow,\[\[\$props\.show\]\]/,

      // Slots compilation (minified)
      /\$slots\s*\.\s*default\s*\?\s*renderList\(/,
      /renderSlot\(\s*_ctx\.\$slots\s*,\s*["']default["']/,
    ],
  },
  {
    name: 'reactivity' as const,
    score: 0.25,
    scripts: [
      // Vue 3 reactivity system (production)
      /reactive\(\{(?:[^{}]|{[^{}]*})*\}\)/,
      /ref\(\s*(?:[^()]+|\([^()]*\))*\s*\)/,

      // Computed properties (minified)
      /computed\(\s*\(\s*\)\s*=>\s*[^,}]+\)/,
      /computed\(\{(?:[^{}]|{[^{}]*})*get:\s*function\s*\(\s*\)\s*\{/,

      // Watch implementation (production)
      /watch\(\s*(?:\(\s*\)\s*=>|function\s*\(\s*\)\s*\{)/,
      /watchEffect\(\s*(?:\(\s*\)\s*=>|function\s*\(\s*\)\s*\{)/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.25,
    scripts: [
      // Component registration (production)
      /defineComponent\(\s*\{(?:[^{}]|{[^{}]*})*setup\s*\(\s*\{\s*props\s*\}/,

      // Props declaration (minified)
      /props:\s*\{(?:[^{}]|{[^{}]*})*type:\s*(?:String|Number|Boolean|Array|Object|Function)/,

      // Lifecycle hooks (production)
      /onMounted\(\s*\(\s*\)\s*=>\s*\{/,
      /onUnmounted\(\s*\(\s*\)\s*=>\s*\{/,

      // Component emits (minified)
      /emits:\s*\{(?:[^{}]|{[^{}]*})*\}|emits:\s*\[(?:[^\[\]]*)\]/,
    ],
  },
  {
    name: 'routing' as const,
    score: 0.15,
    scripts: [
      // Router initialization (production)
      /createRouter\(\s*\{\s*history:\s*createWebHistory\(/,

      // Route definitions (minified)
      /routes:\s*\[\s*\{\s*path:\s*["'][^"']+["']\s*,\s*component:/,

      // Navigation guards (production)
      /beforeRouteEnter\s*\(\s*to\s*,\s*from\s*,\s*next\s*\)\s*\{/,

      // Router link compilation (minified)
      /RouterLink,\{to:[\w$]+\}/,
    ],
  },
  {
    name: 'runtimeVueMarkers' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasVue: window.__VUE__,
          hasVueSetters: window.__VUE_SSR_SETTERS__,
          hasVueInstanceSetters: window.__VUE_INSTANCE_SETTERS__,

          // Check for Vue 3 app container
          hasVue3: !!document.querySelector('[__vue-app__]'),
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
  {
    name: 'runtimeVueLikePatterns' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Vue instance with production markers
          hasVueInstance: (() => {
            const elements = document.querySelectorAll('[data-v-]');
            return (
              elements.length > 0 &&
              Array.from(elements).some((el) =>
                el.getAttribute('data-v-')?.match(/^[a-f0-9]{8}$/)
              )
            );
          })(),

          // Check for Vue rendered content
          hasRenderedContent: (() => {
            const appRoot = document.querySelector('#app');
            return (
              appRoot &&
              appRoot.children.length > 0 &&
              Array.from(appRoot.children).some(
                (el) =>
                  el.hasAttribute('data-v-') ||
                  el.innerHTML.includes('<!--v-if-->')
              )
            );
          })(),

          // Check for Vuex state in production
          // eslint-disable-next-line no-prototype-builtins
          hasVuexState: window.hasOwnProperty('__INITIAL_STATE__'),

          // Check for Vue Router in production
          hasRouter: !!document.querySelector('a[href^="/"][router-link]'),
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
];
