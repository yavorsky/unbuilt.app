import { Page } from 'playwright';

export const bootstrap = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Bootstrap's unique component attributes - only Bootstrap uses data-bs- prefix
      /data-bs-(?:toggle|target|parent|container|placement|trigger|content|template|theme|dismiss|ride|slide-to)=/,
      /data-bs-backdrop="(?:true|false|static)"/,

      // Bootstrap's unique JavaScript API patterns
      /bootstrap\.(?:Modal|Tooltip|Popover|Dropdown|Collapse|Tab|Toast|Carousel|Scrollspy)\.(?:getInstance|getOrCreateInstance|VERSION)\(/,
      /new\s+bootstrap\.(?:Modal|Tooltip|Popover|Dropdown|Collapse|Tab|Toast|Carousel|Scrollspy)\(/,

      // Bootstrap's specific CSS custom properties prefix
      /--bs-(?:breakpoint|modal-zindex|dropdown-zindex|tooltip-zindex|popover-zindex|offcanvas-zindex|toast-zindex)/,

      // Bootstrap's specific modal structure
      /modal-(?:dialog-scrollable|dialog-centered|fullscreen-[a-z]{2}-down|static)/,
      /offcanvas-(?:top|bottom|start|end)(?:\s|modal-backdrop)/,

      // Bootstrap's specific component classes (unique to Bootstrap)
      /navbar-expand-(?:sm|md|lg|xl|xxl)/,
      /nav-(?:tabs|pills|underline)-(?:bordered|justified|fill)/,
      /form-(?:floating|control-plaintext|control-(?:sm|lg)|select-(?:sm|lg)|check-inline|switch-(?:sm|lg))/,

      // Bootstrap's specific button variants
      /btn-(?:close-white|outline-(?:primary|secondary|success|danger|warning|info|light|dark))/,

      // Bootstrap's icon classes (specific to Bootstrap Icons)
      /bi-(?:[a-z0-9]+-)*[a-z0-9]+/,

      // Bootstrap's specific toast structure
      /toast-(?:container|header|body|placement)/,

      // Bootstrap's specific grid overrides
      /g(?:x|y)-(?:sm|md|lg|xl|xxl)-[0-5]/,
      /offset-(?:sm|md|lg|xl|xxl)-(?:1[0-2]|[1-9])/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Bootstrap's unique data attributes
          hasBootstrapAttributes: [
            '[data-bs-toggle]',
            '[data-bs-target]',
            '[data-bs-theme]',
            '[data-bs-ride]',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for Bootstrap's JavaScript API
          hasBootstrapAPI:
            typeof window.bootstrap !== 'undefined' &&
            ['Modal', 'Tooltip', 'Popover', 'Offcanvas'].some(
              (component) =>
                typeof window.bootstrap[component]?.VERSION === 'string'
            ),

          // Check for Bootstrap's unique component structures
          hasBootstrapStructures: [
            '.toast-container[class*="position-"]',
            '.modal-dialog-scrollable',
            '.offcanvas-backdrop',
            '.navbar-expand-lg',
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
      // Core Bootstrap files with version patterns
      /(?:^|\/)bootstrap@[0-9.]+\/dist\/(?:css|js)\/bootstrap(?:\.bundle)?(?:\.min)?\.(?:js|css)$/,
      /(?:^|\/)bootstrap-[0-9.]+(?:\.min)?\.(?:js|css)$/,

      // Bootstrap Icons specific files
      /bootstrap-icons@[0-9.]+\/font\/bootstrap-icons\.(?:css|woff2?)$/,
      /bootstrap-icons\/font\/fonts\/bootstrap-icons\.[a-f0-9]{8}\.(?:woff2?)$/,

      // Bootstrap's specific build outputs
      /bootstrap\.bundle\.(?:min\.)?js(?:\.map)?$/,
      /bootstrap-grid\.(?:min\.)?css(?:\.map)?$/,
      /bootstrap-reboot\.(?:min\.)?css(?:\.map)?$/,
      /bootstrap-utilities\.(?:min\.)?css(?:\.map)?$/,

      // Bootstrap's specific theme files
      /bootstrap\.(?:dark|rtl)\.(?:min\.)?css$/,
    ],
  },
];
