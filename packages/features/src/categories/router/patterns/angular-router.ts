import { Page } from 'playwright';

export const angularRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Angular Router specific imports (minification resistant)
      /["']@angular[/\\]router(?:\/fesm2022\/router\.mjs|\/bundles\/router\.umd\.min\.js)?["']/,
      /["']\@angular\/router\/package\.json["']/,

      // Angular Router's internal DI tokens (survive minification)
      /InjectionToken\(["'](?:ROUTER_CONFIG|ROUTER_INITIALIZER|ROUTER_FORROOT_GUARD)["']\)/,
      /\[Symbol\.for\(["'](?:NgRouter|RouterState|RouteParams)["']\)\]/,
      /__NG_ROUTER_[A-Z_]+__/,

      // Angular Router specific class signatures (minification resistant)
      /class\s+\w+(?:Router|Route|Navigation|UrlTree|UrlSegment)/,
      /\w+\.ɵfac\s*=\s*function\s*\(t\)\s*\{\s*return\s*new\s*\(t\s*\|\|\s*\w+Router\)/,
      /\w+\.ɵprov\s*=\s*\/\*@__PURE__\*\/\s*[ɵ\w]+\(["']Router["']\)/,

      // Angular Router decorators and metadata (minification resistant)
      /ɵɵdefineInjectable\(\{factory:\s*function\s*\w+Router_Factory/,
      /ɵɵdefineNgModule\(\{.*?declarations:\s*\[RouterOutlet\]/,
      /routerNgProbeToken/,
      /RouterInitializer/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Angular Router specific DI tokens and services
          hasAngularRouter: !!(
            // Check for router DI tokens (minification resistant)
            (
              window.ng?.getInjector?.()?.get('Router')?.routerState
                ?.snapshot ||
              window.ng?.getInjector?.()?.get('ActivatedRoute')?.snapshot
                ?.url ||
              // Check for internal properties
              window.__NG_ROUTER_STATE__ ||
              window.__NG_ROUTER_INITIALIZER__
            )
          ),

          // Check for Angular Router specific instance properties
          hasRouterInstance: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              // Router instance with Angular-specific properties combinations
              (('routerState' in obj &&
                'currentUrlTree' in obj &&
                'navigationId' in obj) ||
                // Router state with Angular-specific snapshot structure
                ('_root' in obj &&
                  'firstChild' in obj &&
                  'url' in obj &&
                  'params' in obj) ||
                // Router events with Angular's specific type enumeration
                ('id' in obj &&
                  'url' in obj &&
                  'navigationTrigger' in obj &&
                  'restoredState' in obj))
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
      // Angular Router specific configuration (minification resistant)
      /RouterModule\.(?:forRoot|forChild)\(\s*(?:\[|routes)/,
      /provideRouter\(\s*withRouterConfig\(/,
      /withPreloading\(\s*(?:NoPreloading|PreloadAllModules)\)/,
      /withDebugTracing\(\)/,
      /withRouterConfig\(\{malformedUriErrorHandler:/,

      // Angular Router internal patterns (survive minification)
      /NG_ROUTER_PROVIDERS/,
      /ROUTER_CONFIGURATION/,
      /ROUTER_FORROOT_GUARD/,
      /RouterOutlet\.ngComponentOutlet/,

      // Angular Router specific error handling (minification resistant)
      /new\s+NavigationCancelingError\(/,
      /DefaultTitleStrategy/,
      /EmptyOutletComponent/,
      /RouterConfigLoader/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Angular Router specific build artifacts (minification resistant)
      /@angular[\\/]router[\\/]fesm2022[\\/]router\.mjs$/,
      /@angular[\\/]router[\\/]bundles[\\/]router\.umd\.min\.js$/,
      /@angular[\\/]router[\\/]esm2022[\\/]router\.mjs$/,

      // Angular Router specific lazy chunks (with internal markers)
      /router\.ngfactory\.[a-f0-9]+\.js$/i,
      /router-module\.[a-f0-9]+\.chunk\.js$/i,
      /angular-router\.umd\.[a-f0-9]+\.js$/i,
      /ng\.router\.[a-f0-9]+\.js$/i,

      // Angular Router specific generated files
      /router\.metadata\.json$/i,
      /router\.d\.ts$/i,
      /angular-route-serializer\.[a-f0-9]+\.js$/i,
      /angular-router-preloader\.[a-f0-9]+\.js$/i,
    ],
  },
];
