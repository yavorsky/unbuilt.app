import { Page } from 'playwright';

export const bootstrap = [
  {
    name: 'compilation' as const,
    score: 0.6,
    scripts: [
      // Optimized component attributes - consolidated patterns with length limits
      /data-bs-(?:toggle|target|parent|container|placement|trigger|content|template|theme|dismiss|ride|slide-to)="[^"]{1,50}"/,
      /data-bs-backdrop="(?:true|false|static)"/,

      // Optimized JavaScript API - combined patterns with better boundaries
      /bootstrap\.(?:Modal|Tooltip|Popover|Dropdown|Collapse|Tab|Toast|Carousel|Scrollspy)\.(?:getInstance|getOrCreateInstance|VERSION)\b\(/,
      /new\s+bootstrap\.(?:Modal|Tooltip|Popover|Dropdown|Collapse|Tab|Toast|Carousel|Scrollspy)\b\(/,

      // Optimized CSS properties - bounded search
      /--bs-(?:breakpoint|(?:[a-z]+-)?zindex)\b/,

      // Optimized modal structure - combined patterns
      /modal-(?:dialog-(?:scrollable|centered)|fullscreen-[a-z]{2}-down|static)\b/,
      /offcanvas-(?:top|bottom|start|end)(?:\s|modal-backdrop)\b/,

      // Optimized component classes - consolidated with boundaries
      /navbar-expand-(?:sm|md|lg|xl|xxl)\b/,
      /nav-(?:tabs|pills|underline)-(?:bordered|justified|fill)\b/,
      /form-(?:floating|control-(?:plaintext|sm|lg)|select-(?:sm|lg)|check-inline|switch-(?:sm|lg))\b/,

      // Optimized button variants - combined pattern
      /btn-(?:close-white|outline-(?:primary|secondary|success|danger|warning|info|light|dark))\b/,

      // Optimized icon classes - added length limit and boundary
      /bi-(?:[a-z0-9]+-){0,3}[a-z0-9]+\b/,

      // Optimized toast structure - combined pattern
      /toast-(?:container|header|body|placement)\b/,

      // Optimized grid patterns - combined with boundaries
      /g[xy]-(?:sm|md|lg|xl|xxl)-[0-5]\b/,
      /offset-(?:sm|md|lg|xl|xxl)-(?:1[0-2]|[1-9])\b/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.7,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Optimized attribute checks - single query
          hasBootstrapAttributes:
            document.querySelector(
              '[data-bs-toggle], [data-bs-target], [data-bs-theme], [data-bs-ride]'
            ) !== null,

          // Optimized API check - reduced iterations
          hasBootstrapAPI:
            typeof window.bootstrap === 'object' &&
            ('Modal' in window.bootstrap || 'Tooltip' in window.bootstrap),

          // Optimized structure checks - single query
          hasBootstrapStructures:
            document.querySelector(
              '.toast-container[class*="position-"], .modal-dialog-scrollable, .offcanvas-backdrop, .navbar-expand-lg'
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
      // Optimized core files - added length limits and better boundaries
      /(?:^|\/)bootstrap@[0-9.]{1,10}\/dist\/(?:css|js)\/bootstrap(?:\.bundle)?(?:\.min)?\.(?:js|css)$/,
      /(?:^|\/)bootstrap-[0-9.]{1,10}(?:\.min)?\.(?:js|css)$/,

      // Optimized icons files - added length limits
      /bootstrap-icons@[0-9.]{1,10}\/font\/bootstrap-icons\.(?:css|woff2?)$/,
      /bootstrap-icons\/font\/fonts\/bootstrap-icons\.[a-f0-9]{8}\.(?:woff2?)$/,

      // Optimized build outputs - combined patterns
      /bootstrap\.(?:bundle\.(?:min\.)?js|grid\.(?:min\.)?css|reboot\.(?:min\.)?css|utilities\.(?:min\.)?css)(?:\.map)?$/,

      // Optimized theme files - combined pattern
      /bootstrap\.(?:dark|rtl)\.(?:min\.)?css$/,
    ],
  },
];
