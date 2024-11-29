import { Page } from "playwright";

export const angular = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Angular
      /\bangular\b/i,
      /ng\-version/,
      /\bng\-app\b/,
      /platformBrowser/,
      // Zone.js
      /Zone\$|__zone_symbol__|NgZone/,
      // Common minified patterns
      /__NgCli/,
      /ngDevMode/,
      /NG_COMP_DEF/,
      /ɵ[a-z]+/,  // Angular internal symbols
    ]
  },
  {
    name: 'components' as const,
    score: 0.3,
    runtime: [
      // Component decorators
      /@Component\s*\(/,
      /@Injectable\s*\(/,
      /@Directive\s*\(/,
      /@Pipe\s*\(/,
      // Component features
      /ngOnInit|ngOnDestroy/,
      /ngAfterViewInit|ngAfterContentInit/,
      /ViewChild|ContentChild/,
      // Change detection
      /ChangeDetector|ChangeDetectionStrategy/,
      /detectChanges|markForCheck/,
    ]
  },
  {
    name: 'templates' as const,
    score: 0.25,
    runtime: [
      // Template syntax
      /\*ngIf|\*ngFor/,
      /\[(ngModel)\]/,
      /\(click\)|\(input\)/,
      /\[\(ngModel\)\]/,
      // Template binding
      /\{\{[^}]+\}\}/,
      /\[(?:class|style|id|attr)\./,
      /\((?:click|focus|blur|input)\)/,
      // Common directives
      /ngClass|ngStyle/,
      /ngSwitch|ngSwitchCase/,
    ]
  },
  {
    name: 'routing' as const,
    score: 0.2,
    runtime: [
      // Router
      /RouterModule|Routes/,
      /router\-outlet/,
      /routerLink/,
      /ActivatedRoute/,
      // Navigation
      /Router\.navigate/,
      /NavigationEnd|NavigationStart/,
      /CanActivate|CanDeactivate/,
      /resolveGuard/,
    ]
  },
  {
    name: 'forms' as const,
    score: 0.15,
    runtime: [
      // Forms
      /FormGroup|FormControl/,
      /FormBuilder|FormArray/,
      /Validators\./,
      /FormsModule|ReactiveFormsModule/,
      // Form validation
      /ngModel|ngForm/,
      /required|minlength|maxlength/,
      /\[\(ngModel\)\]/,
      /ValidatorFn|AsyncValidatorFn/,
    ]
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.3,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Angular global
          hasAngularGlobal: !!(window as any).ng,
          // Check for Zone.js
          hasZone: typeof (window as any).Zone !== 'undefined',
          // Check for Angular attributes
          hasAngularAttributes: !!document.querySelector('[ng-version]'),
          // Check for Angular dev mode
          hasDevMode: typeof (window as any).ngDevMode !== 'undefined',
          // Check for Angular router
          hasRouter: !!document.querySelector('router-outlet'),
          // Check for common Angular elements
          hasNgElements: !!document.querySelector('[ng-reflect-]'),
          // Check for Angular bootstrap element
          hasNgApp: !!document.querySelector('[ng-app]'),
        };
        return Object.values(markers).some(Boolean);
      });
    }
  }
 ];
