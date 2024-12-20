import { Page } from 'playwright';

export const solidRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Solid Router imports (survive minification)
      /["']@solidjs\/router(?:\/dist\/|\/)?[^"']*["']/,

      // Solid's core proxy system (minification resistant)
      /\$?\w+\.__propertyCheck/,
      /\$?\w+\.__intercepted/,
      /\$?\w+\.__propertyCache/,

      // Solid Router's unique internal properties (survive mangling)
      /\[Symbol\.for\(["']solid-router-context["']\)\]/,
      /\[Symbol\.for\(["']solid-root["']\)\]/,
      /\[Symbol\.for\(["']solid-track["']\)\]/,
      /\[Symbol\.for\(["']solid-dev["']\)\]/,

      // Development mode markers (preserved in production)
      /"undefined"!=typeof window&&window\.\$PROXY/,
      /DEV_EXPRESSION/,
      /DEVCOMP/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Solid's proxy system (survives minification)
          hasSolidMarkers: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              // Proxy system core properties
              (('__propertyCheck' in obj && '__propertyCache' in obj) ||
                ('__intercepted' in obj &&
                  obj.__propertyCache instanceof WeakMap))
          ),

          // Check for Solid Router's instance (minification resistant)
          hasSolidRouter: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              // Core router properties that survive minification
              (('base' in obj &&
                'location' in obj &&
                obj.location &&
                typeof obj.location === 'object' &&
                '__tracked' in obj.location) ||
                // Route state with proxy tracking
                ('path' in obj && 'params' in obj && '__propertyCheck' in obj))
          ),

          // Check for Solid's unique symbols (preserved in build)
          hasSolidSymbols: !!(
            Symbol.for('solid-router-context') in window ||
            Symbol.for('solid-track') in window ||
            Symbol.for('solid-proxy') in window
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Solid's internal property checks (minification resistant)
      /\w+\.__propertyCheck&&\w+\.__propertyCheck\([^)]+\)/,
      /WeakMap\.prototype\.get\.call\(\w+\.__propertyCache/,
      /\w+\.__interceptor\(\w+,\w+\)/,

      // Solid Router's resource system (survive mangling)
      /createResource\(\{source:/,
      /createMemo\(\{equals:!1\}/,
      /getOwner\(\)\.owner/,

      // Error boundary patterns (preserved in production)
      /throw new Error\("@solidjs\/router: /,
      /SolidRouteError\(/,
      /handleRouterError\(/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Solid Router build artifacts (minification resistant)
      /@solidjs[\\/]router[\\/]dist[\\/][^/]+\.(?:cjs|mjs|js)$/,
      /solid-router\.[\w-]+\.js$/i,
      /router\.[\w-]+\.solidjs\.js$/i,

      // Router chunk patterns (with Solid markers)
      /solid\.[\w-]+\.proxy\.js$/i,
      /proxy\.[\w-]+\.solid\.js$/i,
      /router\.[\w-]+\.solid\.js$/i,
    ],
  },
];
