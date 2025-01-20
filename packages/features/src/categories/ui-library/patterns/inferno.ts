import { Page } from 'playwright';

export const inferno = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core Inferno VNode creation (production)
      /createVNode\(\d+,(?:["'][^"']+["']|\w+),(?:null|\{[^}]*\}|\w+),/,

      // Inferno flags (minified)
      /\$V=\d+,\$C=\d+,\$M=\d+/,
      /\$F=\d+,\$T=\d+/,

      // Inferno normalization (production)
      /normalizeProps\(\{[^}]+\}\)|normalizeChildren\([^)]+\)/,

      // Internal render markers (minified)
      /__render\(\w+,\w+,(?:!0|!1)\)/,
      /__patch\(\w+,\w+,\w+,(?:!0|!1)\)/,

      // Component initialization (production)
      /\$LI=new WeakMap,\$CI=new WeakMap/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.3,
    scripts: [
      // Class component compilation (production)
      /class\s+[$_a-zA-Z][\w$]*\s+extends\s+Component\s*\{\s*render\s*\(\s*\)\s*\{/,

      // Function component compilation (minified)
      /function\s+[$_a-zA-Z][\w$]*\(\{[^}]*\}\)\{return createVNode\(/,

      // Lifecycle methods (production)
      /componentDidMount\(\)\{(?:[^{}]|{[^{}]*})*\}/,
      /componentWillUnmount\(\)\{(?:[^{}]|{[^{}]*})*\}/,

      // Component utilities (minified)
      /createPortal\(\w+,\w+\)/,
      /createRef\(\)/,
      /forwardRef\(\w+\)/,
    ],
  },
  {
    name: 'hooks' as const,
    score: 0.25,
    scripts: [
      // Hook implementation (production)
      /function\s+useState\s*\(\s*\w+\s*\)\s*\{\s*return\s+\$HS\s*\(\s*\d+/,
      /function\s+useEffect\s*\(\s*\w+\s*,\s*\w+\s*\)\s*\{\s*\$HE\s*\(\s*\d+/,

      // Hook initialization (minified)
      /\$HI=new WeakMap,\$HS=function/,
      /\$HR=function\(\w+,\w+\)\{/,

      // State update (production)
      /\[\w+,function\(\w+\)\{return \$HS\(\d+,\w+,\w+\)\}\]/,

      // Effect cleanup (minified)
      /\$HC\(\d+,function\(\)\{/,
    ],
  },
  {
    name: 'routing' as const,
    score: 0.2,
    scripts: [
      // Router initialization (production)
      /createRouter\(\{(?:[^{}]|{[^{}]*})*history:/,

      // Route definitions (minified)
      /\{path:["'][^"']+["'],component:/,

      // Navigation components (production)
      /Link,\{to:["'][^"']+["']/,
      /Route,\{path:["'][^"']+["'],exact:/,

      // Router hooks (minified)
      /useLocation\(\)/,
      /useHistory\(\)/,
      /useParams\(\)/,
    ],
  },
  {
    name: 'compatibility' as const,
    score: 0.15,
    scripts: [
      // React compatibility layer (production)
      /createElement=createVNode/,
      /Component=InfernoComponent/,

      // PropTypes replacement (minified)
      /checkPropTypes\(\w+,\w+,["']\w+["']\)/,

      // DOM utilities (production)
      /findDOMfromVNode\(\w+\)/,
      /hydrate\(\w+,\w+,\w+\)/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Inferno instance with production markers
          hasInfernoDOM: (() => {
            const elements = document.querySelectorAll('[data-vnode]');
            return (
              elements.length > 0 &&
              Array.from(elements).some((el) => {
                const vnodeId = el.getAttribute('data-vnode');
                return vnodeId && /^\d+$/.test(vnodeId);
              })
            );
          })(),

          // Check for rendered components
          hasComponents: (() => {
            const root = document.querySelector('[data-infernoroot]');
            return (
              root &&
              root.children.length > 0 &&
              Array.from(root.children).some(
                (el) =>
                  el.hasAttribute('data-vnode') ||
                  el.hasAttribute('data-inferno-component')
              )
            );
          })(),

          // Check for event handling system
          hasEvents: document.querySelector('[data-inferno-events]') !== null,

          // Check for portal containers
          hasPortals: document.querySelector('[data-inferno-portal]') !== null,
        };

        // Require at least two markers for more reliable detection
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
];
