import { Page } from 'playwright';

export const reactRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core package imports (including minified variants)
      /["'](?:@?[rR](?:eact)?[-.]?[rR]outer(?:[-.]?[dD]om)?|@remix-run\/router)["']/,

      // React Router specific hooks (minification resistant)
      /\buse(?:[NnLlPpRrSsMmHh]|Nav|Loc|Par|Route?|Search|Match|Href)\w*\s*\(/,

      // Internal markers unique to React Router (survive minification)
      /__R(?:EACT_ROUTER|R)_(?:HISTORY|CONTEXT|LOCATION)__/,
      /\$R(?:R|outer)\$/,
      /\[\w+\]=\{(?:useLocation|useNavigate|useParams)\}/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for React Router specific global markers (minification resistant)
          hasRouter:
            !!window.__REACT_ROUTER_HISTORY__ ||
            !!window.__RR_HISTORY__ ||
            !!window.$RR ||
            !!window.$router,

          // Check for React Router specific exports (survives most minification)
          hasRouterExports: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              // Check for multiple hooks to increase confidence
              (('useNavigate' in obj && 'useLocation' in obj) ||
                ('useParams' in obj && 'useRoutes' in obj) ||
                // Check for core router functionality
                ('createBrowserRouter' in obj && 'RouterProvider' in obj) ||
                // Check for data router APIs
                ('useLoaderData' in obj && 'useActionData' in obj))
          ),
        };
        return Object.values(markers).some(Boolean);
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
      /\[\w+\]=(\w+)\(\{basename:/,

      // Data router patterns unique to React Router (minification resistant)
      /(?:loader|action)Data\s*[=:]\s*await\s*\w+\(/,
      /\buse(?:Loader|Action|Revalidator|Navigation|Matches)\w*\s*\(/,

      // Common React Router prop patterns (survive minification)
      /\{(?:\w+:)*\s*(?:errorElement|loader|action|handle|shouldRevalidate)\}/,

      // Internal React Router properties (minification resistant)
      /\._(?:routes?|router|state|location)_/,
      /\[UNSAFE_NavigationContext\]/,
      /\[DataRouterContext\]/,
      /\[DataRouterStateContext\]/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // React Router specific chunk patterns (case insensitive)
      /(?:@?(?:react-)?router(?:-dom)?|@remix-run\/router)[-.]\w+\.js$/i,
      /(?:browser|hash|memory)-?router[-.]\w+\.js$/i,
      /router-provider[-.]\w+\.js$/i,
      /data-router[-.]\w+\.js$/i,
    ],
  },
];
