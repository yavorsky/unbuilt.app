import { Page } from 'playwright';

export const qwikRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Qwik's unique binding attributes (exclusive to Qwik)
      /q:container="[\w-]+"/,
      /q:version="[\w.-]+"/,
      /q:base="[\w-]+"/,
      /q:slot="[\w-]+"/,

      // Qwik-specific serialization (unique to framework)
      /on:qvisible=/,
      /preventdefault:submit/,
      /q:key="[\w-]+"/,
      /bindge:click=/,

      // QwikCity-specific markers (survive minification)
      /\[Symbol\.for\("qk-city"\)\]/,
      /QwikCityMockProvider\$_/,
      /QwikCityProvider\$_/,
      /RouterOutlet\$_/,

      // Qwik's internal hook implementation patterns
      /\$\w+\$_use[A-Z]\w+__\(/, // Qwik's internal hook naming
      /_\$use[A-Z]\w+\$_\([^)]*\)\[Q-\w+\]/, // Qwik's production binding
      /\$\w+\$_use\w+\$_\[Symbol\.for\("qHook"\)\]/, // Qwik's hook registration
      /qrl\((?:["']\w+_\w+["'],\s*)?["']\$\w+\$_use\w+\$_["']\)/, // Qwik's QRL pattern
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Qwik-exclusive DOM patterns
          hasQwikMarkers: !!(
            document.querySelector('[q\\:container]') ||
            document.querySelector('script[type="qwik/json"]') ||
            document.querySelector('[on\\:qvisible]') ||
            document.querySelector('[q\\:key]')
          ),

          // Check for QwikCity-specific state structure
          hasQwikRouter: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              // QwikCity-specific state combinations
              (('$$qrl' in obj && 'symbol' in obj && 'chunk' in obj) ||
                // QwikCity router state
                ('regionalURL' in obj &&
                  'basePathname' in obj &&
                  'trailingSlash' in obj) ||
                // Qwik's unique component structure
                ('$containerState$' in obj &&
                  '$element$' in obj &&
                  '$hooks$' in obj))
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
      // QwikCity-specific patterns (survive minification)
      /endQwikCity\$/,
      /qwikCity\.json/,
      /qwikSerializer\$/,
      /qwikBrowser\$/,

      // Qwik's unique error handling
      /new QwikCityPageError\(/,
      /new QwikError\(/,
      /getErrorHtml\$/,
      /qwikLoadPage\$/,

      // Qwik's unique optimization markers
      /QWIK_VERSION/,
      /QWIK_BUILD/,
      /QWIK_DEVTOOLS/,
      /QWIK_MODULES/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // QwikCity-specific build artifacts
      /qwik-city-plan\.js$/i,
      /qwik-city-middleware\.js$/i,
      /qwik-city-static\.js$/i,
      /qwik-city-not-found\.js$/i,

      // Qwik's unique chunk naming pattern
      /entry\.qwik\.[a-f0-9]+\.js$/i,
      /q-[\w-]+\.qwik\.js$/i,
      /qwik\.[\w-]+\.js$/i,
      /qkc\.[\w-]+\.js$/i,
    ],
  },
];
