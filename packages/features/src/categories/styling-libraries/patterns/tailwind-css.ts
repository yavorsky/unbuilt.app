import { Page } from 'playwright';

export const tailwindCSS = [
  {
    name: 'compilation' as const,
    score: 0.2,
    scripts: [
      // Config markers - combined
      /(?:^|\s)(?:p|m)[trblxy]?-(?:0|0\.5|1\.5|2\.5|3\.5|px|auto)\b/,

      // Color opacity - bounded search
      /(?:^|\s)(?:bg|text|border|ring|shadow|divide)-(?:primary|secondary|accent|neutral)\/(?:[1-9]|[1-9][0-9]|100)\b/,

      // Arbitrary syntax - added length limits
      /\[&_summary::-webkit-details-marker\]:hidden\b/,
      /\[mask-image:(?:linear|radial)-gradient\([^]{1,100}\)\]/,

      // Variant groups - combined patterns
      /(?:^|\s)(?:group|peer)\/(?:edit|tab|modal|item)\b/,

      // Tailwind's unique directive patterns that no other framework uses
      /@tailwind\s+(?:base|components|utilities|variants)/,

      // Container queries - combined
      /(?:@container\/(?:sidebar|main|modal)|container-type:(?:inline-size|normal|size))\b/,

      // Has() selector - bounded
      /has-\[(?:input:checked|\[data-state=active\])\]\b/,

      // Animation patterns - combined
      /(?:animate-(?:spin|ping|pulse|bounce|none)|motion-(?:safe|reduce)-(?:transform|animation))\b/,

      // Scroll utilities - combined with boundaries
      /scroll-(?:mt|mb|ms|me)-[0-4]\b/,
      /snap-(?:start|center|end|align|none)\b/,

      // Aspect and object patterns - combined
      /(?:aspect-(?:auto|square|video)|object-(?:contain|cover|fill|none|scale-down))\b/,

      // Grid patterns - combined
      /(?:grid-(?:flow|rows|cols)-(?:dense|none)|auto-(?:rows|cols)-(?:auto|min|max|fr))\b/,

      // Data attributes - added length limit
      /data-\[(?:state|orientation|side|motion|highlighted)=[^\]]{1,30}\]/,

      // @ rules - added length limits
      /@apply\s+(?:[\w-]+(?:\/[0-9]+)?(?:\s+)?){1,10};/,
      /@screen\s+(?:sm|md|lg|xl|2xl)\s*\{/,
    ],
  },
  {
    name: 'styles' as const,
    score: 0.7,
    stylesheets: [
      // Tailwind's unique CSS variable prefix pattern
      /--tw-(?:ring-inset|ring-offset-width|ring-offset-color|ring-color|ring-offset-shadow|ring-shadow|shadow|shadow-colored)/,

      // Tailwind's specific reset classes format
      /\[-?-tw-[^\]]*\]/,

      // Tailwind's unique space utilities implementation
      /\.space-[xy]-\d+\s*>\s*:not\(\[hidden\]\)\s*~\s*:not\(\[hidden\]\)/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Class combinations - single query
          hasTailwindPatterns:
            document.querySelector(
              '[class*="aspect-"][class*="object-"], ' +
                '[class*="group/"][class*="peer/"], ' +
                '[class*="motion-safe:"][class*="motion-reduce:"]'
            ) !== null,

          // Arbitrary value check - more efficient selector
          hasArbitraryValues:
            document.querySelector('[class*="["],[class*="]"]') !== null,

          // Data attributes
          hasDataAttributes:
            document.querySelector(
              '[data-state][class*="data-[state="],[data-orientation][class*="data-[orientation="]'
            ) !== null,

          // Query check
          hasContainerQueries:
            document.querySelector('[class*="@container/"]') !== null,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
];
