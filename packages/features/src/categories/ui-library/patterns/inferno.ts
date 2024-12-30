import { Page } from 'playwright';

export const inferno = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core Inferno
      /\binferno\b/i,
      /from\s+["']inferno["']/,
      /createVNode/,
      /normalizeProps/,
      // Inferno internal markers
      /__render/,
      /__patch/,
      /\$V/, // VNode reference
      // Common minified patterns
      /_infernoFlags/,
      /InfernoComponent/,
      /infernoClient/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.3,
    scripts: [
      // Component classes
      /Component\s*\{\s*render\s*\(/,
      /PureComponent/,
      /createClass\s*\(/,
      // Lifecycle methods
      /componentDidMount/,
      /componentWillUnmount/,
      /componentDidUpdate/,
      // Component utilities
      /createPortal/,
      /createRef/,
      /forwardRef/,
    ],
  },
  {
    name: 'hooks' as const,
    score: 0.25,
    scripts: [
      // React-like hooks
      /useState\s*\(/,
      /useEffect\s*\(/,
      /useCallback\s*\(/,
      /useMemo\s*\(/,
      // Inferno-specific hooks
      /useRef\s*\(/,
      /useContext\s*\(/,
      /useReducer\s*\(/,
    ],
  },
  {
    name: 'routing' as const,
    score: 0.2,
    scripts: [
      // Inferno Router
      /InfernoRouter/,
      /Route\s*\{/,
      /Link\s*\{/,
      /Switch\s*\{/,
      // Router utilities
      /useLocation/,
      /useHistory/,
      /useParams/,
      /withRouter/,
    ],
  },
  {
    name: 'compatibility' as const,
    score: 0.15,
    scripts: [
      // React compatibility
      /inferno-compat/,
      /createReactClass/,
      /PropTypes/,
      // DOM utilities
      /findDOMNode/,
      /createPortal/,
      /hydrate\s*\(/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Inferno global
          hasInfernoGlobal: typeof window.Inferno !== 'undefined',
          // Check for Inferno version
          hasVersion: !!window.__INFERNO_VERSION__,
          // Check for Inferno devtools
          hasDevTools: !!window.__INFERNO_DEVTOOLS_GLOBAL_HOOK__,
          // Check for Inferno root
          hasRoot: !!document.querySelector('[data-infernoroot]'),
          // Check for component markers
          hasComponents: !!document.querySelector('[data-vnode]'),
          // Check for event handlers
          hasEvents: !!document.querySelector('[data-inferno-events]'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
