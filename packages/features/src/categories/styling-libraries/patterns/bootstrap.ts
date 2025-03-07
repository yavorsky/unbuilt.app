import { Page } from 'playwright';

export const bootstrap = [
  {
    name: 'dataAttributes' as const,
    score: 0.6,
    scripts: [
      // Optimized component attributes - consolidated patterns with length limits
      /data-bs-(?:toggle|target|parent|container|placement|trigger|content|template|theme|dismiss|ride|slide-to)="[^"]{1,50}"/,
      /data-bs-backdrop="(?:true|false|static)"/,
    ],
    stylesheets: [
      // data-bs attr
      /(?:\[data-bs-[a-zA-Z0-9-]+\]|data-bs-[a-zA-Z0-9-]+)/,
    ],
  },
  {
    name: 'copyright' as const,
    score: 0.8,
    stylesheets: [
      /\* Bootstrap\s+v\d+\.\d+\.\d+\s+\(https:\/\/getbootstrap\.com\/\)/,
    ],
  },
  {
    name: 'theme' as const,
    score: 0.9,
    stylesheets: [
      // Theme attribute
      /\[data-bs-theme=(["'])?[a-zA-Z0-9-]+(["'])?\]/,
    ],
  },
  {
    name: 'messages' as const,
    score: 1,
    scripts: [
      /Bootstrap doesn't allow more than one instance per element\. Bound instance:/,
      /throw new TypeError\("Bootstrap's dropdowns require Popper \(https:\/\/popper\.js\.org\)"\)/,
    ],
  },
  {
    name: 'vars' as const,
    score: 0.9,
    scripts: [
      // Check for bs-position prop access
      // Ex. someProp.getPropertyValue("--bs-position") call
      /\.getPropertyValue\(["']--bs-position["']\)/g,
    ],
    stylesheets: [
      // Declaration
      /--bs-[a-zA-Z0-9-]+:\s*[^;]+;/,
      // Usage
      /var\(--bs-[a-zA-Z0-9-]+\)/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1.4,
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
];
