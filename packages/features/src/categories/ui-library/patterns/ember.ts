import { Page } from 'playwright';

export const ember = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core Ember initialization patterns
      /defineProperty\(Ember,["']VERSION["'],\{configurable:!1,enumerable:!0,value:["']\d+\.\d+\.\d+["']\}\)/,
      /\.resolveRegistration\(["']config:environment["']\)/,

      // Dependency Injection system (production)
      /var \w+=new WeakMap,\w+=new WeakMap/,
      /\._super\.apply\(this,arguments\)/,

      // Ember Object model core features
      /\.extend\(\{[^}]*init:function\(\)\{[^}]*this\._super\.apply\(this,arguments\)/,
      /\.reopen\(\{[^}]*willDestroy:function\(\)\{/,

      // Ember's internal property observation system
      /notifyPropertyChange\(this,["'][^"']+["']\)/,
      /addObserver\(this,["'][^"']+["']\)/,
    ],
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

      // Component lifecycle hooks (minified)
      /didInsertElement:function\(\)\{/,
      /willDestroyElement:function\(\)\{/,

      // Tracked properties implementation
      /this\.__tracked__\w+/,
      /tracked\w+\.set\(this,/,
    ],
  },
  {
    name: 'templates' as const,
    score: 0.25,
    scripts: [
      // Production template compilation output
      /function\(\){return\{\w+:function\(\)\{var \w+=this\.\w+/,

      // Helper invocations (production)
      /helpers\[["'][^"']+["']\]\.compute\(/,

      // Component invocation patterns
      /component\$\w+\(this,this\./,
      /modifier\$\w+\(this,this\./,

      // Glimmer template compilation
      /createTemplateFactory\(\{[^}]*"block":\[/,
    ],
  },
  {
    name: 'routing' as const,
    score: 0.2,
    scripts: [
      // Router initialization (production)
      /Router\.map\(function\(\)\{this\.route\(/,

      // Route class definition patterns
      /Route\.extend\(\{(?:[^{}]|{[^{}]*})*model:function\([^)]*\)\{/,

      // Transition methods (minified)
      /\.transitionTo\(["'][^"']+["']\)/,
      /\.replaceWith\(["'][^"']+["']\)/,

      // Route lifecycle hooks
      /beforeModel:function\(\w+\)\{/,
      /afterModel:function\(\w+,\w+\)\{/,
    ],
  },
  {
    name: 'data' as const,
    score: 0.15,
    scripts: [
      // Model definitions (production)
      /Model\.extend\(\{(?:[^{}]|{[^{}]*})*\}\)/,

      // Relationship definitions (minified)
      /belongsTo\(["'][^"']+["']\)/,
      /hasMany\(["'][^"']+["']\)/,

      // Store operations (production)
      /store\.findRecord\(["'][^"']+["'],/,
      /store\.query\(["'][^"']+["'],/,

      // Adapter/Serializer patterns
      /JSONAPIAdapter\.extend\(/,
      /JSONAPISerializer\.extend\(/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check only for production Ember features
          hasEmber: typeof window.Ember === 'object' && !!window.Ember.VERSION,

          // Check for actual rendered components
          hasEmberViews: !!document.querySelector('.ember-view'),

          // Check for Ember Data
          hasEmberData: typeof window.DS === 'object' && !!window.DS.Model,

          // Check for actual route rendering
          hasRouting: !!document.querySelector('.ember-application'),

          // Check for rendered components
          hasComponents: document.querySelectorAll('[id^="ember"]').length > 0,
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
];
