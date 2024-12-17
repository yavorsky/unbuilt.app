import { Page } from 'playwright';

export const jQuery = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // jQuery core detection
      /jQuery|\$\.fn\.|jquery/,
      /\$\([\s\S]*?\)\./,
      /\$\(document\)\.ready\(/,
      // Global utilities
      /\$\.(?:extend|ajax|get|post|getJSON|parseJSON|Deferred)/,
      /\$\.(?:each|map|grep|unique|merge|inArray)/,
      // Minified patterns
      /[^a-zA-Z]fn\[["']/,
      /jQuery\d+/,
      /\$[\d\w]+/,
    ],
  },
  {
    name: 'domManipulation' as const,
    score: 0.25,
    runtime: [
      // Element selection and traversal
      /\$\(['"][\s\S]*['"]\)\.(?:find|closest|parent|children|siblings)/,
      /\.(?:prev|next|filter|not|has|is|contains)/,
      // Manipulation methods
      /\.(?:attr|prop|val|text|html|css|addClass|removeClass|toggleClass)/,
      /\.(?:append|prepend|after|before|remove|empty|clone|wrap)/,
    ],
  },
  {
    name: 'events' as const,
    score: 0.25,
    runtime: [
      // Event handling
      /\.(?:on|off|one|bind|unbind|delegate|undelegate|trigger|live|die)/,
      /\.(?:click|submit|hover|focus|blur|change|keyup|keydown|mouseenter|mouseleave)/,
      // Event utilities
      /\.(?:preventDefault|stopPropagation|stopImmediatePropagation)/,
      /event\.(?:target|currentTarget|relatedTarget|pageX|pageY|which)/,
    ],
  },
  {
    name: 'effects' as const,
    score: 0.2,
    runtime: [
      // Animation and effects
      /\.(?:show|hide|toggle|slideDown|slideUp|slideToggle)/,
      /\.(?:fadeIn|fadeOut|fadeTo|fadeToggle)/,
      /\.(?:animate|stop|delay|finish|queue|dequeue)/,
      // Animation utilities
      /\$\.(?:fx|easing|speed|Animation)/,
    ],
  },
  {
    name: 'ajax' as const,
    score: 0.15,
    runtime: [
      // Ajax methods
      /\$\.(?:ajax|get|post|getJSON|getScript)/,
      /\.(?:load|serialize|serializeArray)/,
      // Ajax settings
      /(?:contentType|dataType|beforeSend|complete|success|error|xhr)/,
      /xhr\.responseText|xhr\.status/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for jQuery global
          hasJQuery:
            typeof window.jQuery !== 'undefined' ||
            typeof window.$ !== 'undefined',

          // // Check for jQuery version
          // hasVersion: typeof window.$?.fn?.jquery === 'string',

          // // Check for jQuery event handlers
          // hasEventHandlers: !!document.querySelector(
          //   '[onclick*="$"], [onclick*="jQuery"]'
          // ),

          // // Check for jQuery data
          // hasJQueryData: Array.from(document.querySelectorAll('*')).some((el) =>
          //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
          //   Object.keys((el as any).dataset ?? {}).some((key) =>
          //     key.startsWith('jquery')
          //   )
          // ),

          // // Check for common jQuery plugins
          // hasPlugins:
          //   typeof window.$?.fn?.modal !== 'undefined' ||
          //   typeof window.$?.fn?.tooltip !== 'undefined',

          // // Check for jQuery AJAX
          // hasAjax: typeof window.$?.ajax === 'function',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
