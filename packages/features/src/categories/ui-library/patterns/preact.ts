import { Page } from 'playwright';

export const preact = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core Preact detection - highly specific patterns
      /(?:window\.)?preact=\{(?:[^}]+)\}/,
      /from\s+["']preact\/(?:jsx-runtime|dist\/preact\.module)["']/,

      // Preact's internal properties (minification-resistant)
      /__preactattr_[$_a-zA-Z0-9]+/,
      /__component[$_a-zA-Z0-9]+/,

      // Preact's VNode properties (with variable name variations)
      /\.__[vkbe][$_a-zA-Z0-9]*/, // Matches minified VNode properties

      // Preact's createElement (h) with proper boundaries
      /(?:^|[^a-zA-Z0-9_$])h\s*\(\s*(?:["'][^\s"']+["']|[A-Za-z_$][\w$]*)\s*,\s*(?:\{|\w+\b|null)\)/,

      // Preact's production build markers
      /\.production\.min\.js["']\}?\)/,
      /\?preact\b.*?\.production\.min\.js/,
    ],
  },
  {
    name: 'rendering' as const,
    score: 0.3,
    scripts: [
      // Preact-specific render patterns
      /(?:^|[^a-zA-Z0-9_$])render\s*\(\s*h\s*\(/,
      /hydrate\s*\(\s*h\s*\(/,

      // Preact's DOM markers (unique to Preact)
      /data-preact(?:-client|-ssr)["']/,
      /preactroot[$_a-zA-Z0-9]+/,

      // Preact's specific attribute handling
      /\[\$?\$(?:ref|key)\$/, // Minification-resistant attribute markers
      /__self\$\s*:\s*true|__source\$\s*:\s*\{/,

      // Preact's diffing algorithm markers
      /\bdiff\s*\(\s*dom\s*,\s*vnode\s*,\s*context\)/,
    ],
  },
  {
    name: 'hooks' as const,
    score: 0.25,
    scripts: [
      // Preact hooks implementation (specific to Preact)
      /options\.__h\s*&&\s*options\.__h\s*\([^)]+\)/,

      // Hook initialization patterns
      /__h\s*=\s*\[\]/,
      /__H\s*=\s*\{__h:/,

      // Preact's hook cleanup
      /__c\s*=\s*!__c/,

      // Preact-specific hook implementations
      /function\s+(?:useState|useReducer)\s*\([^)]*\)\s*\{\s*return\s+__h\s*\(/,
      /function\s+useEffect\s*\([^)]*\)\s*\{\s*__h\s*\(/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.25,
    scripts: [
      // Preact Component class (with proper boundaries)
      /class\s+[A-Za-z_$][\w$]*\s+extends\s+(?:preact\.)?Component\s*\{/,

      // Preact-specific lifecycle methods with context
      /(?:prototype\.|\.prototype\.)(?:componentDidMount|componentWillUnmount)\s*=\s*function\s*\(\)\s*\{/,
      /(?:prototype\.|\.prototype\.)(?:componentDidUpdate|shouldComponentUpdate)\s*=\s*function\s*\([^)]*\)\s*\{/,

      // Preact's Fragment implementation
      /Fragment\s*:\s*\{\s*\[\$?\$type\]\s*:\s*["']fragment["']\s*\}/,

      // Preact's component internals
      /__c\s*=\s*null\s*;\s*__v\s*=\s*null/,
    ],
  },
  {
    name: 'compat' as const,
    score: 0.2,
    scripts: [
      // Preact/compat specific imports
      /from\s+["']preact\/compat["']/,

      // Webpack alias patterns for React compatibility
      /alias:\s*\{\s*["']react["']\s*:\s*["']preact\/compat["']/,
      /alias:\s*\{\s*["']react-dom["']\s*:\s*["']preact\/compat["']/,

      // Preact/compat specific features
      /createPortal\s*:\s*function\s*\(\s*vnode,\s*parent\)/,
      /Suspense\s*:\s*function\s*\(\s*\{\s*children/,
      /lazy\s*:\s*function\s*\(\s*loader\)/,
    ],
  },
  {
    name: 'signals' as const,
    score: 0.15,
    scripts: [
      // Preact Signals implementation
      /from\s+["']@preact\/signals(?:-core)?["']/,

      // Signal creation and computation patterns
      /(?:^|[^a-zA-Z0-9_$])signal\s*\(\s*(?:[^()]*)\s*\)/,
      /(?:^|[^a-zA-Z0-9_$])computed\s*\(\s*\(\s*\)\s*=>\s*\{/,

      // Signal internals (minification-resistant)
      /__value\s*=\s*value/,
      /__subscribers\s*=\s*new\s+Set/,

      // Signal integration with Preact
      /signals\.__/,
      /SIGNAL\s*=/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Preact global object with specific properties
          hasPreact:
            typeof window.preact === 'object' &&
            !!window.preact.h &&
            !!window.preact.render,

          // Check for Preact-specific DOM markers
          hasPreactMarkers: !!document.querySelector(
            '[data-preact-client], [data-preact-ssr]'
          ),

          // Check for Preact internals (highly specific)
          hasOptions: typeof window.__PREACT_OPTIONS__ === 'object',
          hasHooks: typeof window.__PREACT_HOOKS__ === 'object',

          // Check for Preact DevTools
          hasDevTools: typeof window.__PREACT_DEVTOOLS__ === 'object',

          // Check for Preact root element
          hasPreactRoot: !!document.querySelector('[data-preact-root]'),

          // Check for Signals
          hasSignals: typeof window.preact?.signals === 'object',
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
];
