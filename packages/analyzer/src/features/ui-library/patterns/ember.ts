import { Page } from "playwright";

export const ember = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Ember
      /\bEmber\b|\bEmber\./,
      /ember-cli/,
      /ember\.debug\.js/,
      /ember\.prod\.js/,
      // Ember Data
      /DS\.Model/,
      /DS\.attr/,
      /DS\.belongsTo/,
      // Runtime markers
      /__ember_auto_import__/,
      /EMBER_ENV/,
      /EmberENV/,
    ]
  },
  {
    name: 'components' as const,
    score: 0.3,
    runtime: [
      // Component patterns
      /extend\s*\(\s*['"]Component['"]\)/,
      /Ember\.Component\.extend/,
      /\{\{yield\}\}/,
      // Glimmer components
      /class\s+\w+\s+extends\s+Component/,
      /@tracked/,
      /@service/,
      // Actions and events
      /this\.send\(/,
      /this\.actions\./,
      /action\s*\(/,
    ]
  },
  {
    name: 'templates' as const,
    score: 0.25,
    runtime: [
      // Handlebars templates
      /\{\{#if\}\}|\{\{#each\}\}/,
      /\{\{#unless\}\}|\{\{#with\}\}/,
      /\{\{action\}\}|\{\{on\}\}/,
      // Template helpers
      /\{\{input\}\}|\{\{textarea\}\}/,
      /\{\{link-to\}\}/,
      /\{\{get\}\}|\{\{mut\}\}/,
      // Component invocation
      /\{\{[A-Z][^}]+\}\}/,
      /\{\{component\s+/,
    ]
  },
  {
    name: 'routing' as const,
    score: 0.2,
    runtime: [
      // Router patterns
      /Router\.map\s*\(/,
      /this\.route\(/,
      /this\.transitionTo/,
      // Route hooks
      /beforeModel|afterModel/,
      /setupController/,
      /resetController/,
      // Route components
      /\{\{outlet\}\}/,
      /LinkComponent/,
    ]
  },
  {
    name: 'data' as const,
    score: 0.15,
    runtime: [
      // Ember Data
      /DS\.Store/,
      /DS\.RecordArray/,
      /createRecord|deleteRecord/,
      // Relationships
      /hasMany|belongsTo/,
      // Adapters and serializers
      /RESTAdapter|JSONAPIAdapter/,
      /RESTSerializer|JSONAPISerializer/,
    ]
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Ember global
          hasEmber: typeof (window as any).Ember !== 'undefined',
          // Check for Ember Data
          hasEmberData: typeof (window as any).DS !== 'undefined',
          // Check for Ember testing helpers
          hasTestHelpers: typeof (window as any).require?.has?.('ember-qunit'),
          // Check for Ember application
          hasApp: !!(window as any).Ember?.Application?.BOOTED,
          // Check for Ember debugging
          hasDebug: !!(window as any).Ember?.Debug,
          // Check for common Ember elements
          hasEmberView: !!document.querySelector('[id^="ember"]'),
          // Check for Ember CLI
          hasEmberCli: !!(window as any).EmberENV,
        };
        return Object.values(markers).some(Boolean);
      });
    }
  }
 ];