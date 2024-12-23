import { Page } from 'playwright';

export const foundation = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Foundation's specific XY Grid system
      /grid-(?:margin|padding)-(?:x|y)(?:\s|$)/,
      /cell-(?:block|block-container|block-y)(?:\s|$)/,
      /xy-grid-(?:container|frame|cell)(?:\s|$)/,

      // Foundation's unique responsive classes
      /(?:^|\s)(?:medium|large|xlarge|xxlarge)-(?:expand|unstack|offset|push|pull)-\d+(?:\s|$)/,
      /(?:^|\s)responsive-embed-(?:widescreen|panorama|square|portrait)(?:\s|$)/,

      // Foundation's specific data attributes
      /data-(?:whatinput|whatintent|interchange|equalizer-watch|magellan)(?:=|$)/,
      /data-(?:abide|accordion|dropdown|drilldown|responsive-accordion-tabs|responsive-tabs)(?:=|$)/,

      // Foundation's plugin initialization
      /Foundation\.(?:Abide|Accordion|Dropdown|DropdownMenu|Equalizer|Interchange|Magellan|OffCanvas|Orbit|ResponsiveMenu|ResponsiveToggle|Reveal|Slider|SmoothScroll|Sticky|Tabs|Toggler|Tooltip|ResponsiveAccordionTabs)\(/,

      // Foundation's unique component classes
      /off-canvas-(?:content|absolute|fixed|reveal|overlap-(?:left|right|top|bottom))(?:\s|$)/,
      /drilldown-(?:submenu|submenu-cover|subitem|current|parent)(?:\s|$)/,
      /orbit-(?:container|wrapper|slides|slide|bullets|previous|next|figure)(?:\s|$)/,

      // Foundation's specific utility classes
      /(?:^|\s)show-for-(?:sr|landscape|portrait)(?:-only)?(?:\s|$)/,
      /(?:^|\s)hide-for-(?:sr|landscape|portrait)(?:-only)?(?:\s|$)/,

      // Foundation's specific form validation
      /form-error\s+is-visible-(?:abide|equalizer|magellan)(?:\s|$)/,
      /is-invalid-(?:input|label|container)-abide(?:\s|$)/,

      // Foundation's specific JavaScript events
      /'(?:closeme|resizeme|scrollme|mutate|toggled|sticky\.zf|magellan)\.zf/,
      /'(?:down|up|left|right)\.zf\.(?:drilldown|accordion|dropdown)'/,

      // Foundation's specific motion classes
      /mui-(?:enter|leave|slide|fade|hinge|spin|scale)(?:-(?:active|from|to))?(?:\s|$)/,
      /(?:^|\s)is-(?:animating|entering|leaving|active|complete)-mui(?:\s|$)/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Foundation's specific component structure
          hasFoundationComponents: [
            '.off-canvas-absolute[data-off-canvas]',
            '.orbit-container[data-orbit]',
            '.drilldown[data-drilldown]',
            '.accordion-menu[data-accordion-menu]',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for Foundation's specific JavaScript plugins
          hasFoundationPlugins:
            typeof window.Foundation !== 'undefined' &&
            ['Abide', 'Dropdown', 'OffCanvas', 'Orbit'].some(
              (plugin) => typeof window.Foundation[plugin] === 'function'
            ),

          // Check for Foundation's XY Grid implementation
          hasXYGrid: [
            '.grid-x.grid-margin-x',
            '.cell.medium-offset-2',
            '.grid-y.grid-padding-y',
            '.xy-grid-container',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for Foundation's unique data attributes
          hasFoundationData: [
            '[data-whatinput]',
            '[data-interchange]',
            '[data-magellan]',
            '[data-abide]',
          ].some((selector) => document.querySelector(selector) !== null),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Foundation core files with version patterns
      /foundation-sites@[0-9.]+\/dist\/(?:js|css)\/foundation(?:\.min)?\.(?:js|css)$/,
      /foundation-sites\/dist\/(?:js|css)\/plugins\/foundation\.(?:[a-z]+)\.(?:js|css)$/,

      // Foundation's specific build outputs
      /foundation\.(?:core|grid|typography|forms|controls)\.(?:min\.)?(?:js|css)$/,
      /foundation-float\.(?:min\.)?css$/,
      /foundation-prototype\.(?:min\.)?css$/,
      /foundation-rtl\.(?:min\.)?css$/,

      // Foundation's specific plugins
      /foundation\.(?:abide|accordion|drilldown|dropdown|equalizer|interchange|magellan|offcanvas|orbit|responsivemenu|reveal|slider|smoothscroll|sticky|tabs|toggler|tooltip)\.js$/,

      // Foundation's motion UI files
      /motion-ui\/dist\/motion-ui(?:\.min)?\.(?:js|css)$/,
      /foundation-motion-ui\.(?:min\.)?(?:js|css)$/,

      // Foundation's customization files
      /_foundation-settings\.scss$/,
      /foundation-custom\.scss$/,
    ],
  },
];
