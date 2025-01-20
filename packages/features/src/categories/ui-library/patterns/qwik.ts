import { Page } from 'playwright';

export const qwik = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Qwik core initialization (production)
      /\(QWIK\s*=\s*\{\s*_:\s*\[\],\s*r:\s*\[\]\}\)/,
      /\$renderComponent\s*=\s*\(\s*\w+\s*,\s*\w+\s*\)\s*=>/,

      // Qwik symbols (minification-resistant)
      /\[\s*"q:container"\s*\]/,
      /\[\s*"q:slot"\s*\]/,
      /\[\s*"q:template"\s*\]/,

      // QRL handling (production)
      /\$qrl\s*=\s*symbol\$\(\s*["']qrl["']\)/,
      /qrlDEV\s*=\s*\((?:[^()]*|\([^()]*\))*\)\s*=>/,

      // Resource resolution (minified)
      /resolveResource\$\(\s*resource\s*,\s*el\s*,\s*url\)/,

      // Event system initialization
      /createContextId\(\s*["']qc-n["']\)/,
    ],
  },
  {
    name: 'rendering' as const,
    score: 0.3,
    scripts: [
      // JSX Factory output (production)
      /jsx\s*=\s*\(\s*type\s*,\s*props\s*,\s*key\s*\)\s*=>/,
      /jsxs\s*=\s*\(\s*type\s*,\s*props\s*,\s*key\s*\)\s*=>/,

      // Component rendering (minified)
      /\$renderComponent\(\s*\w+\s*,\s*\{\s*["']\$type["']\s*:/,

      // Slot handling (production)
      /Slot\s*=\s*\{\s*\$keyProps:\s*\[["']name["']\]\s*\}/,

      // Resource loading (minified)
      /q:load=["']\w+\.js["']/,
      /on:qvisible\$=["']\w+["']/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.25,
    scripts: [
      // Component definition (production)
      /component\$\s*\(\s*\(\s*\{\s*["']\$props["']\s*\}/,

      // Hooks implementation (minified)
      /useSignal\(\s*\w+\s*\)\s*\{\s*return\s+useStore\(/,
      /useStore\(\s*\{\}\s*\)\s*\{\s*return\s+\$/,

      // Task handling (production)
      /useTask\$\s*\(\s*\{\s*track\s*:\s*\(\s*\)\s*=>/,
      /useResource\$\s*\(\s*\{\s*track\s*:\s*\(\s*\)\s*=>/,
    ],
  },
  {
    name: 'optimization' as const,
    score: 0.2,
    scripts: [
      // Lazy loading patterns (production)
      /lazy\$\s*\(\s*\(\s*\)\s*=>\s*import\(/,
      /noSerialize\s*\(\s*value\s*\)\s*\{\s*return/,

      // Event optimization (minified)
      /\$\$clickEvent\s*=\s*\(\s*\w+\s*\)\s*=>/,
      /\$\$inputEvent\s*=\s*\(\s*\w+\s*\)\s*=>/,

      // Prefetching implementation
      /prefetch\(\s*url\s*,\s*\{\s*signal\s*\}\s*\)/,
    ],
  },
  {
    name: 'serverPatterns' as const,
    score: 0.15,
    scripts: [
      // Server functions (production)
      /server\$\s*\(\s*async\s*\(\s*\{\s*request\s*\}\s*\)\s*=>/,

      // Route handling (minified)
      /routeLoader\$\s*\(\s*\(\s*\{\s*params\s*,\s*url\s*\}\s*\)\s*=>/,
      /routeAction\$\s*\(\s*async\s*\(\s*\{\s*request\s*\}\s*\)\s*=>/,

      // Form validation (production)
      /validator\$\s*\(\s*\[\s*\w+\s*\]\s*\)/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Qwik container with proper attributes
          hasContainer: (() => {
            const container = document.querySelector('[q\\:container]');
            return (
              container !== null &&
              container.hasAttribute('q:version') &&
              container.hasAttribute('q:render')
            );
          })(),

          // Check for Qwik components
          hasComponents: (() => {
            const elements = document.querySelectorAll('[q\\:id]');
            return (
              elements.length > 0 &&
              Array.from(elements).some(
                (el) =>
                  el.hasAttribute('q:key') || el.hasAttribute('on:qvisible')
              )
            );
          })(),

          // Check for resource loading
          hasResources: document.querySelectorAll('[q\\:load]').length > 0,

          // Check for event listeners
          hasEvents: document.querySelectorAll('[on\\:click\\$]').length > 0,

          // Check for slots
          hasSlots: document.querySelectorAll('[q\\:slot]').length > 0,
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
];
