import { Page } from 'playwright';

export const jQuery = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // jQuery factory definition (production)
      /typeof\s+jQuery\s*===?\s*["']function["']/,
      /\(function\s*\(\s*global\s*,\s*factory\s*\)\s*\{\s*(?:[^{}]|\{[^{}]*\})*jQuery\s*=\s*factory/,

      // jQuery.fn patterns (highly specific)
      /jQuery\.fn\s*=\s*jQuery\.prototype\s*=\s*\{/,
      /jQuery\.extend\(\s*\{\s*(?:[^{}]|\{[^{}]*\})*\}\s*\)/,

      // jQuery internal markers (minified but unique)
      /jQuery\.(?:cssHooks|cssNumber|cssProps|style)\s*=/,
      /jQuery\.(?:error|noop|now|isEmptyObject)\s*=/,
    ],
  },
  {
    name: 'domManipulation' as const,
    score: 0.25,
    scripts: [
      // jQuery-specific DOM manipulation (not generic methods)
      /\.before\(\s*function\s*\(\s*\)\s*\{\s*return\s+jQuery/,
      /\.after\(\s*function\s*\(\s*\)\s*\{\s*return\s+jQuery/,

      // jQuery unique selectors and methods
      /jQuery\.find\s*=\s*Sizzle/,
      /jQuery\.unique\s*=\s*Sizzle\.uniqueSort/,

      // jQuery-specific attribute handling
      /jQuery\.attrHooks\s*=\s*\{/,
      /jQuery\.propHooks\s*=\s*\{/,
    ],
  },
  {
    name: 'events' as const,
    score: 0.25,
    scripts: [
      // jQuery event system (unique to jQuery)
      /jQuery\.event\s*=\s*\{(?:[^{}]|\{[^{}]*\})*\}/,
      /jQuery\.Event\s*=\s*function\s*\(\s*src\s*\)\s*\{/,

      // jQuery-specific event handling
      /jQuery\.removeEvent\s*=\s*function\s*\(\s*elem\s*,\s*type\s*,\s*handle\s*\)\s*\{/,

      // jQuery event hooks
      /jQuery\.event\.(?:special|fix|props)\s*=/,
    ],
  },
  {
    name: 'effects' as const,
    score: 0.3,
    scripts: [
      // jQuery-specific animation system
      /jQuery\.(?:Animation|Tween)\s*=\s*function\s*\(\s*elem\s*,\s*options\s*,\s*prop\s*,\s*end\s*\)\s*\{/,

      // jQuery fx hooks
      /jQuery\.fx\.(?:tick|timer|interval|start|stop)\s*=/,

      // jQuery-specific easing
      /jQuery\.easing\s*=\s*\{\s*(?:[^{}]|\{[^{}]*\})*\}/,
    ],
  },
  {
    name: 'ajax' as const,
    score: 0.3,
    scripts: [
      // jQuery-specific AJAX implementation
      /jQuery\.(?:ajax|get|post|getJSON|getScript)\s*=\s*function\s*\(/,

      // jQuery transport system
      /jQuery\.ajaxTransport\s*=\s*function\s*\(/,

      // jQuery-specific AJAX events
      /jQuery\.(?:ajaxPrefilter|ajaxSetup|ajaxSettings)\s*=/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for jQuery with specific version and features
          hasJQuery: (() => {
            if (typeof window.jQuery === 'function') {
              const jq = window.jQuery;
              // Check for core jQuery properties
              return (
                typeof jq.fn === 'object' &&
                typeof jq.ajax === 'function' &&
                typeof jq.extend === 'function' &&
                typeof jq.event === 'object'
              );
            }
            return false;
          })(),

          // Check for jQuery data
          hasJQueryData: (() => {
            if (typeof window.jQuery === 'function') {
              const el = document.createElement('div');
              const testKey = 'jqueryDataTest';
              window.jQuery(el).data(testKey, true);
              const hasData = !!window.jQuery(el).data(testKey);
              window.jQuery(el).removeData(testKey);
              return hasData;
            }
            return false;
          })(),

          // Check for jQuery event system
          hasEventSystem: (() => {
            if (typeof window.jQuery === 'function') {
              return (
                typeof window.jQuery.Event === 'function' &&
                typeof window.jQuery.event.special === 'object'
              );
            }
            return false;
          })(),
        };

        // Require at least three markers for higher confidence
        return Object.values(markers).filter(Boolean).length >= 3;
      });
    },
  },
];
