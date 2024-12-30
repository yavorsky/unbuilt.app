import { Page } from 'playwright';

export const foundation = [
  {
    name: 'compilation' as const,
    score: 0.6,
    scripts: [
      // Optimized Grid system - combined patterns with boundaries
      /grid-(?:margin|padding)-[xy](?:\s|$)/,
      /cell-(?:block(?:-container|-y)?)\b/,
      /xy-grid-(?:container|frame|cell)\b/,

      // Optimized responsive classes - added length limits and boundaries
      /(?:^|\s)(?:medium|large|xlarge|xxlarge)-(?:expand|unstack|offset|push|pull)-\d{1,2}(?:\s|$)/,
      /(?:^|\s)responsive-embed-(?:widescreen|panorama|square|portrait)\b/,

      // Optimized data attributes - consolidated patterns
      /data-(?:whatinput|whatintent|interchange|equalizer-watch|magellan|abide|accordion|dropdown|drilldown|responsive-(?:accordion-tabs|tabs))(?:=|$)/,

      // Optimized plugin initialization - bounded search
      /Foundation\.(?:Abide|Accordion|Dropdown(?:Menu)?|Equalizer|Interchange|Magellan|OffCanvas|Orbit|ResponsiveMenu|ResponsiveToggle|Reveal|Slider|SmoothScroll|Sticky|Tabs|Toggler|Tooltip|ResponsiveAccordionTabs)\b\(/,

      // Optimized component classes - combined with boundaries
      /off-canvas-(?:content|absolute|fixed|reveal|overlap-(?:left|right|top|bottom))\b/,
      /drilldown-(?:submenu(?:-cover)?|subitem|current|parent)\b/,
      /orbit-(?:container|wrapper|slides|slide|bullets|previous|next|figure)\b/,

      // Optimized utility classes - consolidated
      /(?:^|\s)(?:show|hide)-for-(?:sr|landscape|portrait)(?:-only)?\b/,

      // Optimized form validation - combined patterns
      /(?:form-error\s+is-visible|is-invalid-(?:input|label|container))-(?:abide|equalizer|magellan)\b/,

      // Optimized JavaScript events - bounded length
      /'(?:closeme|resizeme|scrollme|mutate|toggled|sticky\.zf|magellan)\.zf'/,
      /'(?:down|up|left|right)\.zf\.(?:drilldown|accordion|dropdown)'/,

      // Optimized motion classes - consolidated with boundaries
      /mui-(?:enter|leave|slide|fade|hinge|spin|scale)(?:-(?:active|from|to))?\b/,
      /(?:^|\s)is-(?:animating|entering|leaving|active|complete)-mui\b/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.7,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Optimized component checks - single query
          hasFoundationComponents:
            document.querySelector(
              '.off-canvas-absolute[data-off-canvas], .orbit-container[data-orbit], ' +
                '.drilldown[data-drilldown], .accordion-menu[data-accordion-menu]'
            ) !== null,

          // Optimized plugin check - reduced property lookups
          hasFoundationPlugins:
            typeof window.Foundation === 'object' &&
            (window.Foundation.Abide || window.Foundation.OffCanvas),

          // Optimized grid check - single query
          hasXYGrid:
            document.querySelector(
              '.grid-x.grid-margin-x, .cell.medium-offset-2, ' +
                '.grid-y.grid-padding-y, .xy-grid-container'
            ) !== null,

          // Optimized data attribute check - single query
          hasFoundationData:
            document.querySelector(
              '[data-whatinput], [data-interchange], [data-magellan], [data-abide]'
            ) !== null,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Optimized core files - added length limits
      /foundation-sites@[0-9.]{1,10}\/dist\/(?:js|css)\/foundation(?:\.min)?\.(?:js|css)$/,
      /foundation-sites\/dist\/(?:js|css)\/plugins\/foundation\.[a-z]{1,20}\.(?:js|css)$/,

      // Optimized build outputs - combined patterns
      /foundation\.(?:core|grid|typography|forms|controls|float|prototype|rtl)(?:\.min)?\.(?:js|css)$/,

      // Optimized plugins - consolidated pattern
      /foundation\.(?:abide|accordion|drilldown|dropdown|equalizer|interchange|magellan|offcanvas|orbit|responsivemenu|reveal|slider|smoothscroll|sticky|tabs|toggler|tooltip)\.js$/,

      // Optimized motion UI - combined patterns
      /(?:motion-ui\/dist\/motion-ui|foundation-motion-ui)(?:\.min)?\.(?:js|css)$/,

      // Optimized customization files - already optimal
      /_foundation-settings\.scss$/,
      /foundation-custom\.scss$/,
    ],
  },
];
