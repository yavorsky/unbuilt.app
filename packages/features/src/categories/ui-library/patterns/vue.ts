import { Page } from 'playwright';

export const vue = [
  {
    name: 'coreRuntime' as const,
    score: 0.6,
    scripts: [
      // Vue internal properties (minification-resistant)
      /__v_isRef=!0/,
      /__v_isReactive=!0/,
      /__v_raw/,
      /\.__ob__\b/,

      /__VUE_SSR_CONTEXT__/,
      /\$el\.__vue__\s*=\s*\w+/,
      /getVueComponent\s*:/,
      /\$vnode(?:\.ssrContext)?/,

      // Vue 3 compiler output
      /\[\$\$\]/, // props destructure
    ],
  },
  {
    name: 'vue-2' as const,
    score: 0.2,
    scripts: [/new Vue\(\{(?:[^{}]|{[^{}]*})*el:["'][^"']+["']/],
  },
  {
    name: 'vue-3' as const,
    score: 0.2,
    scripts: [/const\s+[_$a-zA-Z][\w$]*\s*=\s*createApp\s*\(\s*\{[^}]*\}\s*\)/],
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
    name: 'components' as const,
    score: 0.25,
    scripts: [
      // Component registration (production)
      /defineComponent\(\s*\{(?:[^{}]|{[^{}]*})*setup\s*\(\s*\{\s*props\s*\}/,

      // Props declaration (minified)
      /props:\s*\{(?:[^{}]|{[^{}]*})*type:\s*(?:String|Number|Boolean|Array|Object|Function)/,

      // Component emits (minified)
      /emits:\s*\{(?:[^{}]|{[^{}]*})*\}|emits:\s*\[(?:[^\[\]]*)\]/,
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
    score: 0.8,
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
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
];
