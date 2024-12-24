import { Page } from 'playwright';

export const tailwindCSS = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Optimized spacing scale - combined with boundaries
      /(?:^|\s)(?:p|m)[trblxy]?-(?:0|0\.5|1\.5|2\.5|3\.5|px|auto)\b/,

      // Optimized color opacity - bounded search
      /(?:^|\s)(?:bg|text|border|ring|shadow|divide)-(?:primary|secondary|accent|neutral)\/(?:[1-9]|[1-9][0-9]|100)\b/,

      // Optimized arbitrary syntax - added length limits
      /\[&_summary::-webkit-details-marker\]:hidden\b/,
      /\[mask-image:(?:linear|radial)-gradient\([^]{1,100}\)\]/,

      // Optimized variant groups - combined patterns
      /(?:^|\s)(?:group|peer)\/(?:edit|tab|modal|item)\b/,

      // Optimized container queries - combined
      /(?:@container\/(?:sidebar|main|modal)|container-type:(?:inline-size|normal|size))\b/,

      // Optimized has() selector - bounded
      /has-\[(?:input:checked|\[data-state=active\])\]\b/,

      // Optimized animation patterns - combined
      /(?:animate-(?:spin|ping|pulse|bounce|none)|motion-(?:safe|reduce)-(?:transform|animation))\b/,

      // Optimized scroll utilities - combined with boundaries
      /scroll-(?:mt|mb|ms|me)-[0-4]\b/,
      /snap-(?:start|center|end|align|none)\b/,

      // Optimized aspect and object patterns - combined
      /(?:aspect-(?:auto|square|video)|object-(?:contain|cover|fill|none|scale-down))\b/,

      // Optimized grid patterns - combined
      /(?:grid-(?:flow|rows|cols)-(?:dense|none)|auto-(?:rows|cols)-(?:auto|min|max|fr))\b/,

      // Optimized data attributes - added length limit
      /data-\[(?:state|orientation|side|motion|highlighted)=[^\]]{1,30}\]/,

      // Optimized @ rules - added length limits
      /@apply\s+(?:[\w-]+(?:\/[0-9]+)?(?:\s+)?){1,10};/,
      /@screen\s+(?:sm|md|lg|xl|2xl)\s*\{/,

      // Optimized config markers - combined
      /(?:tailwind\.config\.|defaultTheme|colors|screens|spacing|plugins)\b/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Optimized class combinations - single query
          hasTailwindPatterns:
            document.querySelector(
              '[class*="aspect-"][class*="object-"], ' +
                '[class*="group/"][class*="peer/"], ' +
                '[class*="motion-safe:"][class*="motion-reduce:"]'
            ) !== null,

          // Optimized arbitrary value check - more efficient selector
          hasArbitraryValues:
            document.querySelector('[class*="["],[class*="]"]') !== null,

          // Optimized data attributes - single query
          hasDataAttributes:
            document.querySelector(
              '[data-state][class*="data-[state="],[data-orientation][class*="data-[orientation="]'
            ) !== null,

          // Container query check - already optimal
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
      // Optimized config files - combined patterns
      /(?:tailwind|postcss)\.config\.(?:js|ts|cjs|mjs)$/,

      // Optimized output files - added boundaries
      /\.tailwind\.(?:css|min\.css)$/,
      /tailwind\.(?:base|components|utilities)\.css$/,

      // Optimized PostCSS files - combined patterns
      /\.postcss\.(?:css|min\.css)$/,
      /postcss-(?:prefixed|processed)\.css$/,

      // Optimized build artifacts - combined with boundaries
      /tailwind(?:css)?-(?:jit|merged|preflight|base|components|utilities)\.css$/,

      // Optimized source files - more specific
      /(?:^|\/)(?:global|app|main|index)\.css$/,
    ],
  },
];
