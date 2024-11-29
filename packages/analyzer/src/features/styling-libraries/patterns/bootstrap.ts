import { Page } from 'playwright';

export const bootstrap = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Core Bootstrap classes
      /(?:^|\s)(?:container|row|col(?:-\d+)?|d-(?:flex|grid|none)|navbar|nav)(?:\s|$)/,
      /(?:^|\s)(?:btn|badge|alert|card|modal|form|table)(?:-[a-z]+)?(?:\s|$)/,

      // Grid system (minification resistant)
      /col-(?:sm|md|lg|xl|xxl)?-\d+/,
      /offset-(?:sm|md|lg|xl|xxl)?-\d+/,
      /order-(?:sm|md|lg|xl|xxl)?-\d+/,

      // Components and utilities
      /(?:^|\s)(?:bg|text|border|rounded|m|p)(?:-[a-z0-9]+)?(?:\s|$)/,
      /(?:^|\s)(?:flex|float|position|d|w|h)-/,

      // Bootstrap specific attributes
      /data-bs-(?:toggle|target|dismiss|ride)/,
      /aria-(?:expanded|controls|label|hidden)/,

      // JavaScript components
      /new\s+bootstrap\./,
      /\$\(.*\)\.(?:modal|tooltip|popover|dropdown|collapse|alert)/,

      // Variables and custom properties
      /--bs-[\w-]+/,
      /\$\([\s\S]*\.popover\(/,

      // Common minified patterns
      /\.active/,
      /\.show/,
      /\.fade/,
      /\.collapse/
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Bootstrap's core classes
          hasGridSystem: document.querySelector('[class*="col-"], [class*="row"], .container') !== null,

          // Check for common components
          hasComponents: !!(
            document.querySelector('.btn') ||
            document.querySelector('.nav') ||
            document.querySelector('.card') ||
            document.querySelector('.alert')
          ),

          // Check for Bootstrap data attributes
          hasDataAttributes: document.querySelector('[data-bs-toggle], [data-bs-target]') !== null,

          // Check for Bootstrap JavaScript
          hasBootstrapJS: !!(window as any).bootstrap,

          // Check for modal/popover structures
          hasStructures: !!(
            document.querySelector('.modal') ||
            document.querySelector('.popover') ||
            document.querySelector('.dropdown-menu')
          ),

          // Check for utilities
          hasUtilities: document.querySelector('[class*="bg-"], [class*="text-"], [class*="m-"], [class*="p-"]') !== null
        };

        return Object.values(markers).some(Boolean);
      });
    }
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Core files
      /bootstrap/,
      /bootstrap\.[\w-]+\.css$/,
      /bootstrap\.bundle\.js$/,

      // Common build output patterns
      /bootstrap\.[a-f0-9]+\.css$/,
      /bootstrap\.[a-f0-9]+\.js$/,

      // Common chunk names
      /vendor\.bootstrap\.[a-f0-9]+\.js$/,
      /chunk\.bootstrap\.[a-f0-9]+\.js$/
    ]
  }
]