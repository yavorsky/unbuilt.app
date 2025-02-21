import { Page } from 'playwright';

export const emberRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.9,
    scripts: [
      // Imports
      /@ember\/-internals\/[a-zA-Z-]+/,

      // Core Ember initialization patterns
      /defineProperty\(Ember,["']VERSION["'],\{configurable:!1,enumerable:!0,value:["']\d+\.\d+\.\d+["']\}\)/,
      /Ember - JavaScript Application Framework/,

      // Ember Object model core features

      // Ember's internal property observation system
      /notifyPropertyChange\(this,["'][^"']+["']\)/,

      // File path
      /define\(['"]@ember\/[^"']+["']/,

      // Load hooks
      /'EMBER_LOAD_HOOKS'/,

      // Deprecations url
      /deprecations\.emberjs\.com/,

      // Declare scope
      /function\s*\(global,\s*Ember\)/,
    ],
  },
  {
    name: 'glimmer' as const,
    score: 0.9,
    scripts: [/define\(['"]([@]glimmer\/[^"']+)["']/],
  },
  {
    name: 'components' as const,
    score: 0.3,
    scripts: [
      // Glimmer component definitions (production)
      /setComponentTemplate\((\w+),class extends(\w+\.)?Component\{/,
      /createTemplateFactory\(\{id:["'][^"']+["'],block:/,

      // Classic component patterns (production)
      /Component\.extend\(\{(?:[^{}]|{[^{}]*})*\}\)/,
    ],
  },
  {
    name: 'templates' as const,
    score: 0.25,
    scripts: [
      // Production template compilation output
      /function\(\){return\{\w+:function\(\)\{var \w+=this\.\w+/,

      // Glimmer template compilation
      /createTemplateFactory\(\{[^}]*"block":\[/,
    ],
  },
  {
    name: 'rumtimeEnv' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check only for production Ember features
          hasEmber: typeof window.Ember === 'object' && !!window.Ember.VERSION,
          hasEmberEnv: typeof window.EmberENV === 'object',
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'runtimeExecution' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for actual rendered components
          hasEmberViews: !!document.querySelector(
            '.ember-view, .ember-application'
          ),

          // Check for Ember Data
          hasEmberData: typeof window.DS === 'object',

          // Check for actual route rendering
          hasRouting: !!document.querySelector('.ember-application'),

          // Check for rendered components
          hasComponents: document.querySelectorAll('[id^="ember"]').length > 0,
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
