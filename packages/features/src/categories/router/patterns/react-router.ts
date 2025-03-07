import { Page } from 'playwright';

export const reactRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.8,
    scripts: [
      // Router-specific constants that survive minification
      /"remix-router-transitions"/,
      /"react-router-scroll-positions"/,

      // Distinctive error messages
      /@remix-run\/router error/,
      /createHashRouter.*manually changes the URL/,
      /blocker on a POP navigation/,
      /router only supports one blocker at a time/,

      // Remix-specific messaging
      /💿 Hey developer 👋.*Check out https:\/\/remix\.run\/guides\/errors/,

      // Router imports and components
      /(?:from\s+["']|\b)react-router(?:\/dom)?["']/,

      // Common patterns in minified code
      /\.hasOwnProperty\("remix-router-transitions"\)/,
      /\["react-router-scroll-positions"\]/,

      // Error boundary checks
      /@remix-run\/router.*silently in production/,
    ],
  },
  {
    name: 'olderVersions' as const,
    score: 0.7,
    scripts: [
      // Check for pendingLocation prop
      /([a-zA-Z0-9_$]+)\._pendingLocation\s*&&\s*\1\.setState\(\s*\{\s*location:\s*\1\._pendingLocation/,

      // staticContextUpdate
      // Example:
      //   e.props.staticContext || (e.unlisten = e.props.history.listen(function(t) {
      //     n._isMounted && n.setState({
      //         location: t
      //     })
      // }))
      /([a-zA-Z0-9_$]+)\.props\.(?:staticContext|[a-zA-Z0-9_$]+)\s*\|\|\s*\(\1\.(?:unlisten|[a-zA-Z0-9_$]+)\s*=\s*\1\.props\.history\.listen\(function\(([a-zA-Z0-9_$]+)\)\s*\{\s*([a-zA-Z0-9_$]+)\._isMounted\s*&&\s*\3\.setState\(\s*\{\s*location:\s*\2/,

      // computed rood match
      /match:\s*([a-zA-Z0-9_$]+)\.computeRootMatch\(([a-zA-Z0-9_$]+)\.state\.location\.pathname\)/g,
    ],
  },
  {
    name: 'browser-cheks' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Docusaurus SSR context
          hasRouter:
            !!window.__REACT_ROUTER_HISTORY__ || !!window.__RR_HISTORY__,
          dataRouter: !!window.__reactRouterDataRouter,
          hasContext: !!window.__reactRouterContext,
          manifest: !!window.__reactRouterManifest,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'version' as const,
    score: 1,
    runtime: async (page: Page) => {
      return page.evaluate(() => {
        return typeof window.__reactRouterVersion === 'string';
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    scripts: [
      // React Router specific route configuration (minification resistant)
      /(?:create|use)[BHM]?\w*Router\s*\(\s*\[/,
      /RouterProvider\s*\{\s*router:/,

      // Common React Router prop patterns (survive minification)
      /\[UNSAFE_NavigationContext\]/,
      /\[DataRouterContext\]/,
      /\[DataRouterStateContext\]/,
    ],
  },
];
