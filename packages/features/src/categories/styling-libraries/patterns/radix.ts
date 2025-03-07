import { Page } from 'playwright';

export const radix = [
  {
    name: 'compilation' as const,
    score: 1,
    scripts: [
      // Detects Radix-specific data attributes (transpiled)
      // Examples:
      // {"data-radix-dropdown-menu-content":!0}
      // e.createElement("div",{"data-radix-tooltip-arrow":!0})
      // setAttribute("data-radix-accordion-content","")
      /\[data-radix-[^\]]*\]/,

      // Detects Radix CSS variables in minified code
      // Examples:
      // "transform":"translateY(var(--radix-dropdown-menu-content-transform-origin))"
      // "height":"var(--radix-accordion-content-height)"
      // var(--radix-tooltip-trigger-width)
      /(?:"var\(--radix-[^)]*\)"|'var\(--radix-[^)]*\)'|var\(--radix-[^)]*\))/g,

      // Detects Radix data-radix-focus-guard set
      // Examples:
      // x.setAttribute("data-radix-focus-guard","true")
      // someVar.setAttribute("data-radix-focus-guard","")
      /[a-zA-Z0-9_$]+\.setAttribute\("data-radix-focus-guard",\s*".*?"\)/,

      // Detects Radix UI package paths in bundled/minified code
      // Examples:
      // require("@radix-ui/react-dialog")
      // n.r(t),n.d(t,{Root:()=>l.Root});var r=n(72453),i=n("@radix-ui/react-dropdown-menu")
      // e.exports={"react-dialog":()=>import("@radix-ui/react-dialog")}
      /["']@radix-ui\/(?:react|vue|svelte)-[a-z0-9-]+["']/,
    ],
  },
  {
    name: 'browserRadixDataAttributes' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Checks for Radix-specific data attributes in the rendered DOM
        // Even in minified code, these attributes remain unchanged in the DOM
        return !!document.querySelector(
          [
            '[data-radix-accordion-content]',
            '[data-radix-alert-dialog-content]',
            '[data-radix-avatar-image]',
            '[data-radix-checkbox]',
            '[data-radix-collapsible-content]',
            '[data-radix-context-menu]',
            '[data-radix-dialog-content]',
            '[data-radix-dropdown-menu]',
            '[data-radix-hover-card]',
            '[data-radix-menu]',
            '[data-radix-navigation-menu]',
            '[data-radix-popover]',
            '[data-radix-popper]',
            '[data-radix-portal]',
            '[data-radix-popper-content-wrapper]',
            '[data-radix-scroll-area]',
            '[data-radix-select]',
            '[data-radix-slider]',
            '[data-radix-tabs]',
            '[data-radix-toast]',
            '[data-radix-toggle-group]',
            '[data-radix-tooltip]',
          ].join(',')
        );
      });
    },
  },
  {
    name: 'globalRadix' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Checks for Radix-specific global variables in the rendered DOM
        // Even in minified code, these variables remain unchanged in the DOM
        const key = Symbol.for('radix-ui');
        // @ts-expect-error Use symbol as a key to access global radix
        return window[key];
      });
    },
  },
  {
    name: 'styles' as const,
    score: 1,
    stylesheets: [
      // Detects Radix CSS variables in stylesheets (these usually survive minification)
      // Examples:
      // --radix-accordion-content-width:100%;
      // .a{--radix-dropdown-menu-content-transform-origin:var(--radix-popper-transform-origin)}
      // :root{--radix-tooltip-content-available-width:300px}
      /--radix-(?:accordion|alert-dialog|avatar|checkbox|collapsible|context-menu|dialog|dropdown-menu|hover-card|menu|navigation-menu|popover|radio-group|scroll-area|select|slider|tabs|toast|toggle-group|tooltip)-[a-z0-9-]+/,

      // Detects Radix data attribute selectors in minified CSS
      // Examples:
      // [data-radix-dropdown-menu-content]{...}
      // [data-radix-tooltip=e]{...}
      // [data-radix-accordion-content],[data-radix-accordion-trigger]{...}
      /\[data-radix-(?:accordion|alert-dialog|avatar|checkbox|collapsible|context-menu|dialog|dropdown-menu|hover-card|menu|navigation-menu|popover|radio-group|scroll-area|select|slider|tabs|toast|toggle-group|tooltip)(?:-[a-z0-9-]+)?\]/,
    ],
  },
  {
    name: 'stringPatterns' as const,
    score: 0.9,
    scripts: [
      /you can wrap it with our VisuallyHidden component\.\n\nFor more information, see https:\/\/radix-ui\.com\/primitives\/docs\/components\//,
    ],
  },
];
