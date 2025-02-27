import { Page } from 'playwright';

export const tailwindCSS = [
  {
    name: 'tailwindDefined' as const,
    score: 1.0, // Highest confidence - these are unique to Tailwind
    scripts: [
      // Tailwind directives in JavaScript files
      /@tailwind\s+(?:base|components|utilities|variants)\b/,
      /@layer\s+(?:base|components|utilities)\b/,
    ],
    stylesheets: [
      // Copyright header pattern - extremely specific to Tailwind
      /\/\*\s*!\s*tailwindcss\s+v\d+\.\d+\.\d+\s*\|\s*MIT\s*License\s*\|\s*https:\/\/tailwindcss\.com\s*\*\//,
      // Tailwind's unique CSS variable prefix
      /--tw-(?:ring-inset|ring-offset-width|ring-offset-color|ring-color|ring-offset-shadow|ring-shadow|shadow|shadow-colored)/,

      // Tailwind's space utilities implementation - very unique
      /\.space-[xy]-\d+\s*>\s*:not\(\[hidden\]\)\s*~\s*:not\(\[hidden\]\)/,

      // Generated utility class pattern with Tailwind's namespace
      /\[-?-tw-[^\]]*\]/,

      // Base css vars
      /--tw-[a-z-]+:\s*[^;]*;/,

      // Multiple vars in block
      /(?:\*|:before|:after|::before|::after|::backdrop)\s*\{[^}]*(?:--tw-[a-z-]+:[^;]*;.*){5,}/s,

      // Reset structure
      /\*\s*,\s*:after\s*,\s*:before\s*\{[^}]*--tw-[a-z-]+:/,

      // Backdrop with tw
      /::backdrop\s*\{[^}]*--tw-[a-z-]+:/,
    ],
    documents: [
      // Tailwind-specific class combinations in HTML
      /<[^>]+class="[^"]*(?:p|m)[trblxy]?-(?:\d+(?:\.\d+)?|auto|px)[^"]*(?:text|bg)-(?:[\w-]+(?:-\d+)?(?:\/\d+)?)[^"]*"/i,

      // Tailwind's arbitrary value syntax in HTML
      /<[^>]+class="[^"]*\[[^\]]+\][^"]*"/i,
    ],
  },

  {
    name: 'commonStyles' as const,
    score: 0.8, // Very likely Tailwind but not guaranteed
    scripts: [
      // Tailwind-specific directives in JS
      /@apply\s+(?:[\w-]+(?:\/[0-9]+)?(?:\s+)?){1,15};/,
      /@variants\s+(?:[\w-]+(?:,\s*[\w-]+)*)\s*\{/,
      /@screen\s+(?:sm|md|lg|xl|2xl)\b/,
    ],
    stylesheets: [
      // Generated Tailwind classes using color opacity syntax
      /\.(?:bg|text|border)-(?:[\w-]+)(?:-\d+)?\/\d+/,

      // Tailwind's rotate
      /--tw-(?:translate-[xy]|rotate|skew-[xy]|scale-[xy]):/,

      // Tailwind's ring
      /--tw-ring-(?:inset|offset-width|offset-color|color|offset-shadow|shadow):/,

      // Tailwind's responsive variant markers
      /\.(?:sm|md|lg|xl|2xl)\\:[\w-]+/,
    ],
    documents: [
      // Group/peer patterns in HTML
      /<[^>]+class="[^"]*(?:group|peer)\/(?:[\w-]+)[^"]*"/i,

      // Variant patterns in HTML
      /<[^>]+class="[^"]*(?:hover|focus|active|group-hover|dark):[\w-]+[^"]*"/i,

      // Multiple utility classes following Tailwind conventions
      /<[^>]+class="(?:[^"]*\s)?(?:flex|grid)\s+(?:items|justify)-(?:center|start|end|between)[^"]*"/i,
    ],
  },

  {
    name: 'mediaAndStates' as const,
    score: 0.6,
    scripts: [
      // Color patterns with opacity modifiers in JS
      /(?:^|\s)(?:bg|text|border|ring)-(?:primary|secondary|accent|neutral)\/(?:[1-9]|[1-9][0-9]|100)\b/,

      // Container queries mentions in JS
      /(?:@container\/(?:sidebar|main|modal)|container-type:(?:inline-size|normal|size))\b/,
    ],
    stylesheets: [
      // Tailwind's mobile-first media queries
      /@media\s+\(min-width:\s+(?:640px|768px|1024px|1280px|1536px)\)/,

      // Generated variant classes
      /\.(?:hover|focus|active|group-hover|peer-hover|dark)\\:/,
    ],
    documents: [
      // Animation patterns in HTML
      /<[^>]+class="[^"]*animate-(?:spin|ping|pulse|bounce|none)[^"]*"/i,

      // Data attribute selectors in HTML
      /<[^>]+class="[^"]*data-\[(?:state|orientation|side|motion|highlighted)[^\]]+\][^"]*"/i,

      // Tailwind-like width/height patterns
      /<[^>]+class="[^"]*(?:w|h)-(?:full|screen|auto|\d+\/\d+|\d+)[^"]*"/i,
    ],
  },
  {
    name: 'props' as const,
    score: 0.3, // Could be Tailwind or other libraries/frameworks
    scripts: [
      // Utility patterns in JS that could exist in other libraries
      /(?:^|\s)(?:p|m)[trblxy]?-(?:0|0\.5|1\.5|2\.5|3\.5|px|auto)\b/,

      // Aspect and object mentions in JS
      /(?:^|\s)(?:aspect-(?:auto|square|video)|object-(?:contain|cover|fill|none|scale-down))\b/,
    ],
    stylesheets: [
      // Basic utility classes that could be in other frameworks
      /\.(?:flex|grid|block|inline|hidden)\b/,
      /\.(?:w|h)-(?:\d+\/\d+|auto|full)\b/,
    ],
    documents: [
      // Basic flex/grid patterns in HTML
      /<[^>]+class="[^"]*(?:flex|grid)[^"]*"/i,

      // Simple spacing utilities in HTML
      /<[^>]+class="[^"]*(?:p|m)[trblxy]?-\d+[^"]*"/i,

      // Overflow utilities
      /<[^>]+class="[^"]*overflow-(?:hidden|auto|scroll|visible)[^"]*"/i,
    ],
  },

  {
    name: 'browser' as const,
    score: 0.5, // Browser-based detection with better confidence
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for definitive Tailwind markers
          hasTailwindNamespace: (() => {
            // Look for CSS variables with tw- prefix in computed styles
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const styles = window.getComputedStyle(el);
              for (let i = 0; i < styles.length; i++) {
                const prop = styles[i];
                if (prop.startsWith('--tw-')) {
                  return true;
                }
              }
            }
            return false;
          })(),

          // Check for utility combo patterns highly specific to Tailwind
          hasTailwindUtilityPatterns: (() => {
            // Look for slash syntax for opacity
            const opacityPattern = /bg-\w+-\d+\/\d+|text-\w+-\d+\/\d+/;
            const elements = document.querySelectorAll('[class]');
            for (const el of elements) {
              if (opacityPattern.test(el.className)) {
                return true;
              }
            }
            return false;
          })(),

          // Check for arbitrary value pattern
          hasArbitraryValues:
            document.querySelector('[class*="["],[class*="]"]') !== null,

          // Check for multiple responsive breakpoints in classes
          hasResponsiveUtilities: (() => {
            const classes = Array.from(document.querySelectorAll('[class]'))
              .map((el) => el.className)
              .join(' ');

            // Check for at least two different breakpoints
            const breakpoints = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];
            let count = 0;
            for (const bp of breakpoints) {
              if (classes.includes(bp)) count++;
            }
            return count >= 2;
          })(),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
];
