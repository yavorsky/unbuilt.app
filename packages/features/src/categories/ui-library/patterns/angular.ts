import { Page } from 'playwright';

export const angular = [
  {
    name: 'coreRuntime' as const,
    score: 1,
    scripts: [
      // Angular platform initialization (minification-resistant)
      /platformBrowser\w*\s*\(\s*\[\s*\{\s*ngZone\s*:\s*["']zone\.js["']/,

      // Angular internal symbols (with boundaries)
      /ɵcmp|ɵmod|ɵfac|ɵinj|ɵprov|ɵdef/,

      // Zone assertions
      /assert(Not)?InAngularZone()/,

      // Angular zone check
      /isInAngularZone()/,

      // Zone.js runOutsideAngular pattern
      /runOutsideAngular\s*\(\s*\(\)\s*=>/,

      // Ng-zone event
      /NgZoneEvent/,

      // Policty indicator
      /createPolicy\(["']angular#[^"']+["']\)/,

      // Zone.js specific patterns
      /Zone\.__load_patch\(['"]angular['"],\s*function/,
      /__Zone_enable_cross_context_check/,
      /__zone_symbol__BLACK_LISTED_EVENTS/,

      // Angular DI and compilation (production patterns)
      /\[\s*"ngInjectableDef"\s*,\s*ɵɵdefine/,
      /ɵɵdefineInjectable\s*\(\s*\{\s*factory:/,

      // Angular module definition (minified)
      /defineNgModule\s*\(\s*\{\s*type:\s*\w+,\s*bootstrap:/,

      // Version marker (reliable across versions)
      /data-ng-version=["']\d+\.\d+\.\d+["']/,

      /__ignore_ng_zone__/,

      /angularZoneInstanceIdProperty/,

      // Production mode flags
      /ngDevMode\s*=\s*false/,
    ],
  },
  {
    name: 'messages' as const,
    score: 0.9,
    scripts: [
      /Standard Angular field decorators are not supported in JIT mode/,
      /Expected to be in Angular Zone, but it is not!/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.3,
    scripts: [
      // Component definition (production)
      /ɵɵdefineComponent\s*\(\s*\{\s*type:\s*\w+,\s*selectors:\s*\[\s*\[/,

      // Component factory pattern
      /ɵɵfactoryDef\s*\(\s*type,\s*view/,

      // Component lifecycle hooks (minified)
      /prototype\.ngOnInit\s*=\s*function\s*\(\s*\)\s*\{/,
      /prototype\.ngOnDestroy\s*=\s*function\s*\(\s*\)\s*\{/,

      // Change detection patterns (production)
      /ɵɵdetectChanges\s*\(\s*\)/,
      /ChangeDetectorRef\.prototype\.markForCheck/,

      // View queries (minified)
      /ɵɵviewQuery\s*\(\s*\w+\s*,\s*\d+/,
      /ɵɵcontentQuery\s*\(\s*\w+\s*,\s*\d+/,
    ],
  },
  {
    name: 'templates' as const,
    score: 0.25,
    scripts: [
      // Template compilation output (production)
      /ɵɵtemplate\s*\(\s*\d+\s*,\s*[A-Za-z]\w*\s*,\s*\d+\s*,\s*\d+/,
      /ɵɵtemplateRefExtractor/,

      // Structural directives (minified)
      /ɵɵelementContainerStart\s*\(\s*\d+\s*,\s*\[\s*["']\*ngIf["']/,
      /ɵɵelementContainerStart\s*\(\s*\d+\s*,\s*\[\s*["']\*ngFor["']/,

      // Event bindings (production)
      /ɵɵlistener\s*\(\s*["'][^"']+["']\s*,\s*function/,

      // Property bindings (production)
      /ɵɵproperty\s*\(\s*["'][^"']+["']\s*,\s*/,
      /ɵɵattribute\s*\(\s*["'][^"']+["']\s*,\s*/,
    ],
  },
  {
    name: 'routing' as const,
    score: 0.2,
    scripts: [
      // Router configuration (production)
      /RouterModule\.forRoot\s*\(\s*\[\s*\{\s*path\s*:/,
      /ɵɵRouterModule\s*\(\s*\[\s*\{\s*path\s*:/,

      // Router outlet (minified)
      /router-outlet/,
      /RouterOutlet\.prototype\.ngOnDestroy/,

      // Navigation guards (production)
      /CanActivate\s*:\s*\[/,
      /CanDeactivate\s*:\s*\[/,

      // Router events (minified)
      /NavigationStart\s*\.\s*prototype\s*\.\s*toString/,
      /NavigationEnd\s*\.\s*prototype\s*\.\s*toString/,
    ],
  },
  {
    name: 'forms' as const,
    score: 0.15,
    scripts: [
      // Reactive forms (production)
      /FormGroup\.prototype\.registerControl/,
      /FormBuilder\.prototype\.group/,

      // Form validation (minified)
      /Validators\.required/,
      /Validators\.minLength\s*\(\s*\d+\s*\)/,

      // Form directives (production)
      /NgModel\.prototype\.ngOnChanges/,
      /FormControlDirective\.prototype\.ngOnChanges/,

      // Form control registration (minified)
      /ControlContainer\.prototype\.registerOnChange/,
      /AbstractControl\.prototype\.statusChanges/,
    ],
  },
  {
    name: 'runtimeZone' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Zone.js with Angular patches
          hasZone:
            typeof window.Zone !== 'undefined' &&
            !!window.Zone['__symbol__']('angular'),
        };

        return !!Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'runtimeExecution' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Angular global with specific properties
          hasAngular: !!(window.ng && window.ng.probe),

          // Check for Angular version attribute
          hasVersion: !!document.querySelector('[ng-version]'),

          // Check for Angular dev mode
          hasDevMode: typeof window.ngDevMode !== 'undefined',

          // Check for Angular router outlet
          hasRouter: !!document.querySelector('router-outlet'),

          // Check for Angular bootstrap
          hasBootstrap: !!document.querySelector('[ng-app], [ng-controller]'),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'ssr' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Universal state transfer
          hasUniversalState:
            !!window.UNIVERSAL_STATE ||
            !!document.querySelector('#_TRANSFER_STATE'),

          // Platform server context
          hasPlatformServer:
            document.documentElement.hasAttribute('ng-server-context'),

          // Server-side rendered content markers
          hasServerMarkers: !!document.querySelector(
            'nguniversal-preboot-root'
          ),

          // Pre-rendered content check
          hasPrerenderedContent: (() => {
            const appRoot = document.querySelector('app-root');
            return (
              appRoot &&
              appRoot.children.length > 0 &&
              !appRoot.hasAttribute('ng-version')
            );
          })(),

          // Transfer state markers
          hasTransferData: !!document.querySelector(
            'script#UNIVERSAL_STATE_ID'
          ),
        };

        // Require at least two SSR markers
        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
];
