import { Page } from 'playwright';

export const foundation = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Core Foundation classes
      /foundation-/,
      /(?:^|\s)(?:grid-x|grid-y|cell|grid-container)/,
      /(?:^|\s)(?:button|callout|card|menu|top-bar|off-canvas)/,

      // Grid system
      /(?:^|\s)(?:small-\d+|medium-\d+|large-\d+)/,
      /(?:^|\s)(?:align-(?:center|right|justify|spaced))/,
      /(?:^|\s)(?:shrink|grow|auto)/,

      // Component patterns
      /(?:^|\s)(?:dropdown|reveal|tooltip|accordion|tabs)/,
      /data-(?:dropdown|tooltip|tabs|accordion)/,
      /data-open|data-close|data-toggle/,

      // Common utility classes
      /(?:^|\s)(?:float-(?:left|right|center))/,
      /(?:^|\s)(?:show-for-|hide-for-)/,
      /(?:^|\s)(?:clearfix|visible|invisible)/,

      // Motion UI
      /motion-ui/,
      /(?:^|\s)(?:slide-in-|slide-out-|fade-in|fade-out)/,

      // JavaScript initialization
      /\$\(document\)\.foundation\(/,
      /Foundation\.(?:Reveal|Dropdown|Tooltip)/,

      // Common minified patterns
      /\[data-whatinput=/,
      /is-active/,
      /is-open/,
      /is-visible/
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Grid system checks
          hasGridSystem: document.querySelector('.grid-x, .grid-y, .cell') !== null,

          // Component checks
          hasComponents: !!(
            document.querySelector('.button') ||
            document.querySelector('.callout') ||
            document.querySelector('.menu') ||
            document.querySelector('.top-bar')
          ),

          // Data attributes
          hasDataAttributes: document.querySelector('[data-dropdown], [data-tooltip], [data-accordion]') !== null,

          // Foundation global object
          hasFoundation: typeof (window as any).Foundation !== 'undefined',

          // Common utility classes
          hasUtilities: document.querySelector('.float-left, .float-right, .clearfix, .show-for-medium') !== null,

          // XY Grid specific
          hasXYGrid: document.querySelector('.grid-margin-x, .grid-margin-y') !== null
        };

        return Object.values(markers).some(Boolean);
      });
    }
  },
  {
    name: 'files' as const,
    score: 0.2,
    filenames: [
      // Core files
      /foundation(?:-sites)?/,
      /foundation\.(?:min\.)?(?:js|css)$/,

      // Common build outputs
      /foundation\.[a-f0-9]+\.(?:js|css)$/,

      // Motion UI
      /motion-ui/,

      // Chunk names
      /foundation-[\w-]+\.js$/,
      /chunk-foundation-[\w-]+\.js$/
    ]
  }
 ]