import { Page } from 'playwright';

export const astro = [
  {
    name: 'core' as const,
    score: 1,
    scripts: [
      // Astro-specific globals and identifiers that survive minification
      /Astro\.self/,
      /astro:js/,
      /astro:html/,
      /astro:page/,
      /\/client\/.*?astro\./,
      /astro:scripts/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 1,
    documents: [
      // Astro-specific attributes and islands
      /astro-island/,
      /data-astro-cid-/,
      /astro-client-only/,
      /data-astro-transition-/,
      /class="astro-./, // Astro's scoped styles pattern
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.8,
    scripts: [
      // Astro hydration markers
      /astro:after-hydration/,
      /astro:before-hydration/,
      /props\.hydrate/,
      /astro:hydration/,
      /data-astro-hydrate/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const allElements = document.querySelectorAll('*');

        // Filter for elements with data-astro-cid- attributes
        const astroElements = Array.from(allElements).filter((el) => {
          return Array.from(el.attributes).some((attr) =>
            attr.name.startsWith('data-astro-cid-')
          );
        });

        const markers = {
          // Check for Astro-specific attributes that survive minification
          withElements: !!astroElements.length,
          hasAstroIsland: !!document.querySelector('astro-island'),
          hasAstroCid: !!document.querySelector('[data-astro-cid]'),
          hasAstroTransition: !!document.querySelector(
            '[data-astro-transition]'
          ),
          // Look for Astro's specific style handling
          hasAstroStyles: !!document.querySelector('style[data-astro-dev]'),
          // Check for view transitions
          hasViewTransitions: !!document.querySelector('astro-head-mock'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    score: 0.3,
    name: 'ssr' as const,
    scripts: [
      // Astro SSR patterns
      /astro:only/,
      /data-astro-source/,
      /astro-static-slot/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Astro's SSR markers
          hasStaticSlot: !!document.querySelector('[astro-static-slot]'),
          hasAstroSource: !!document.querySelector('[data-astro-source]'),
          // Check for server-rendered islands
          hasSSRIsland: !!document.querySelector(
            'astro-island[data-astro-cid][ssr]'
          ),
          // Check for Astro's static rendering markers
          hasStaticMarker: !!document.querySelector('[data-astro-static]'),
          // Check for client directives
          hasClientDirective: !!document.querySelector('[data-astro-client]'),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
];
