import { Page } from 'playwright';

export const angularRouter = [
  {
    name: 'coreRuntime' as const,
    score: 1,
    scripts: [
      // Angular Router's internal DI tokens (survive minification)
      /InjectionToken\(["'](?:ROUTER_CONFIG|ROUTER_INITIALIZER|ROUTER_FORROOT_GUARD)["']\)/,
      /\[Symbol\.for\(["'](?:NgRouter|RouterState|RouteParams)["']\)\]/,
      /__NG_ROUTER_[A-Z_]+__/,

      // Angular Router specific class signatures (minification resistant)
      /\w+\.ɵfac\s*=\s*function\s*\(t\)\s*\{\s*return\s*new\s*\(t\s*\|\|\s*\w+Router\)/,
      /\w+\.ɵprov\s*=\s*\/\*@__PURE__\*\/\s*[ɵ\w]+\(["']Router["']\)/,

      // Angular Router decorators and metadata (minification resistant)
      /ɵɵdefineInjectable\(\{factory:\s*function\s*\w+Router_Factory/,
      /ɵɵdefineNgModule\(\{.*?declarations:\s*\[RouterOutlet\]/,
      /routerNgProbeToken/,
      /emptyRouterOutlet/,
      /router-outlet/,
      /registerNonRouterCurrentEntryChangeListener/,
      /\.generateNgRouterState/,
      /\.nonRouterCurrentEntryChangeSubscription/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasRouterElement: !!document.querySelector('router-outlet'),

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
      /withRouterConfig\(\{malformedUriErrorHandler:/,

      // Angular Router internal patterns (survive minification)
      /NG_ROUTER_PROVIDERS/,
      /ROUTER_CONFIGURATION/,
      /ROUTER_FORROOT_GUARD/,
      /RouterOutlet\.ngComponentOutlet/,

      // Angular Router specific error handling (minification resistant)
      /new\s+NavigationCancelingError\(/,
      /EmptyOutletComponent/,
    ],
  },
];
