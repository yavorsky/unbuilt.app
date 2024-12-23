import { Page } from 'playwright';

export const tailwindCSS = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Tailwind's unique spacing scale pattern
      /(?:^|\s)(?:p|m)(?:[trblxy])?-(?:0|0\.5|1\.5|2\.5|3\.5|px|auto)(?:\s|$)/,

      // Tailwind's specific color opacity patterns
      /(?:^|\s)(?:bg|text|border|ring|shadow|divide)-(?:primary|secondary|accent|neutral)\/[0-9]+(?:\s|$)/,

      // Tailwind's unique arbitrary property syntax
      /\[&_summary\::-webkit-details-marker\]:hidden/,
      /\[mask-image:(?:linear|radial)-gradient\([^\]]+\)\]/,

      // Tailwind's specific variant groups
      /(?:^|\s)group\/(?:edit|tab|modal|item)(?:\s|$)/,
      /(?:^|\s)peer\/(?:edit|tab|modal|item)(?:\s|$)/,

      // Tailwind's unique @container queries
      /@container\/(?:sidebar|main|modal)/,
      /container-type:(?:inline-size|normal|size)/,

      // Tailwind's has() selector patterns
      /has-\[input:checked\]/,
      /has-\[\[data-state=active\]\]/,

      // Tailwind's unique animation patterns
      /animate-(?:spin|ping|pulse|bounce|none)(?:\s|$)/,
      /motion-(?:safe|reduce)-(?:transform|animation)/,

      // Tailwind's scroll behavior utilities
      /scroll-(?:mt|mb|ms|me)-(?:0|1|2|3|4)(?:\s|$)/,
      /snap-(?:start|center|end|align|none)(?:\s|$)/,

      // Tailwind's unique aspect ratio utilities
      /aspect-(?:auto|square|video)(?:\s|$)/,
      /object-(?:contain|cover|fill|none|scale-down)(?:\s|$)/,

      // Tailwind's grid auto-flow utilities
      /grid-(?:flow|rows|cols)-(?:dense|none)(?:\s|$)/,
      /auto-(?:rows|cols)-(?:auto|min|max|fr)(?:\s|$)/,

      // Tailwind's specific data attribute selectors
      /data-\[(?:state|orientation|side|motion|highlighted)=(?:[^\]]+)\]/,

      // Tailwind's unique @ rules
      /@apply\s+(?:[\w-]+(?:\/[0-9]+)?(?:\s+)?)+;/,
      /@screen\s+(?:sm|md|lg|xl|2xl)\s*\{/,

      // Tailwind's config markers
      /tailwind\.config\.(?:js|ts|cjs|mjs)/,
      /defaultTheme|colors|screens|spacing|plugins/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Tailwind's unique class combinations
          hasTailwindPatterns: [
            '[class*="aspect-"][class*="object-"]',
            '[class*="group/"][class*="peer/"]',
            '[class*="motion-safe:"][class*="motion-reduce:"]',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for Tailwind's arbitrary value syntax
          hasArbitraryValues: Array.from(document.querySelectorAll('*')).some(
            (el) =>
              Array.from(el.classList).some((cls) => /\[.+:.+\]/.test(cls))
          ),

          // Check for Tailwind's specific data attributes
          hasDataAttributes: [
            '[data-state][class*="data-[state="]',
            '[data-orientation][class*="data-[orientation="]',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for Tailwind's container queries
          hasContainerQueries:
            document.querySelector('[class*="@container/"]') !== null,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Tailwind configuration files
      /tailwind\.config\.(?:js|ts|cjs|mjs)$/,
      /postcss\.config\.(?:js|ts|cjs|mjs)$/,

      // Tailwind output files with specific naming
      /\.tailwind\.(?:css|min\.css)$/,
      /tailwind\.(?:base|components|utilities)\.css$/,

      // PostCSS processing indicators
      /\.postcss\.(?:css|min\.css)$/,
      /postcss-(?:prefixed|processed)\.css$/,

      // Specific build artifacts
      /tailwind-(?:jit|merged|preflight)\.css$/,
      /tailwindcss-(?:base|components|utilities)\.css$/,

      // Source files with Tailwind directives
      /(?:^|\/)(?:global|app|main|index)\.css$/,
    ],
  },
];
