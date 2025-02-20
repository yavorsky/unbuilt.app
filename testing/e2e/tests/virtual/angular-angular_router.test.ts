import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects angular with router and ngrx in a simple app', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: 'dist',
      buildCommand: 'ng build',
      dependencies: {
        '@angular-devkit/build-angular': '19.1.8',
        '@angular/cli': '19.1.8',
        '@angular/core': '19.1.7',
        '@angular/common': '19.1.7',
        '@angular/compiler': '19.1.7',
        '@angular/platform-browser': '19.1.7',
        '@angular/platform-browser-dynamic': '19.1.7',
        '@angular/router': '19.1.7',
        '@ngrx/store': '19.0.1',
        '@ngrx/effects': '19.0.1',
        'zone.js': '0.15.0',
      },
      files: {
        'package.json': `
        {
          "name": "simple-angular-app",
          "version": "1.0.0",
          "scripts": {
            "build": "ng build",
            "start": "ng serve"
          }
        }
      `,

        'angular.json': `
        {
          "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
          "version": 1,
          "projects": {
            "app": {
              "projectType": "application",
              "root": "",
              "sourceRoot": "src",
              "architect": {
                "build": {
                  "builder": "@angular-devkit/build-angular:browser",
                  "options": {
                    "outputPath": "dist",
                    "index": "src/index.html",
                    "main": "src/main.ts",
                    "polyfills": ["zone.js"],
                    "tsConfig": "tsconfig.json",
                    "optimization": true,
                    "sourceMap": false,
                    "namedChunks": true,
                    "extractLicenses": true,
                    "vendorChunk": true,
                    "buildOptimizer": true
                  }
                }
              }
            }
          }
        }
      `,

        'src/main.ts': `
        import { bootstrapApplication } from '@angular/platform-browser';
        import { AppComponent } from './app/app.component';
        import { provideRouter } from '@angular/router';
        import { provideStore } from '@ngrx/store';
        import { routes } from './app/app.routes';
        import { counterReducer } from './app/store/counter.reducer';

        bootstrapApplication(AppComponent, {
          providers: [
            provideRouter(routes),
            provideStore({ count: counterReducer })
          ]
        });
      `,

        'src/app/app.component.ts': `
        import { Component } from '@angular/core';
        import { RouterOutlet, RouterLink } from '@angular/router';
        import { CommonModule } from '@angular/common';

        @Component({
          selector: 'app-root',
          standalone: true,
          imports: [RouterOutlet, RouterLink, CommonModule],
          template: \`
            <nav>
              <a routerLink="/">Home</a> |
              <a routerLink="/about">About</a>
            </nav>
            <router-outlet></router-outlet>
          \`
        })
        export class AppComponent { }
      `,

        'src/app/app.routes.ts': `
        import { Routes } from '@angular/router';
        import { HomeComponent } from './home.component';
        import { AboutComponent } from './about.component';

        export const routes: Routes = [
          { path: '', component: HomeComponent },
          { path: 'about', component: AboutComponent }
        ];
      `,

        'src/app/home.component.ts': `
        import { Component } from '@angular/core';
        import { CommonModule } from '@angular/common';
        import { Store } from '@ngrx/store';
        import { increment, decrement } from './store/counter.actions';

        @Component({
          selector: 'app-home',
          standalone: true,
          imports: [CommonModule],
          template: \`
            <h1>Counter: {{ count$ | async }}</h1>
            <button (click)="increment()">+</button>
            <button (click)="decrement()">-</button>
          \`
        })
        export class HomeComponent {
          readonly count$;

          constructor(private store: Store<{ count: number }>) {
            this.count$ = this.store.select(state => state.count);
          }

          increment() {
            this.store.dispatch(increment());
          }

          decrement() {
            this.store.dispatch(decrement());
          }
        }
      `,

        'src/app/about.component.ts': `
        import { Component } from '@angular/core';
        import { CommonModule } from '@angular/common';

        @Component({
          selector: 'app-about',
          standalone: true,
          imports: [CommonModule],
          template: \`
            <h1>About</h1>
            <p>This is a simple Angular app with routing and NgRx.</p>
          \`
        })
        export class AboutComponent { }
      `,

        'src/app/store/counter.actions.ts': `
        import { createAction } from '@ngrx/store';

        export const increment = createAction('[Counter] Increment');
        export const decrement = createAction('[Counter] Decrement');
      `,

        'src/app/store/counter.reducer.ts': `
        import { createReducer, on } from '@ngrx/store';
        import { increment, decrement } from './counter.actions';

        export const initialState = 0;

        export const counterReducer = createReducer(
          initialState,
          on(increment, state => state + 1),
          on(decrement, state => state - 1)
        );
      `,

        'tsconfig.json': `
        {
          "compilerOptions": {
            "target": "ES2022",
            "module": "ES2022",
            "moduleResolution": "node",
            "lib": ["ES2022", "dom"],
            "experimentalDecorators": true,
            "emitDecoratorMetadata": true,
            "skipLibCheck": true,
            "sourceMap": true,
            "declaration": false,
            "strict": true,
            "noImplicitOverride": true,
            "noPropertyAccessFromIndexSignature": true,
            "noImplicitReturns": true,
            "noFallthroughCasesInSwitch": true
          },
          "angularCompilerOptions": {
            "enableI18nLegacyMessageIdFormat": false,
            "strictInjectionParameters": true,
            "strictInputAccessModifiers": true,
            "strictTemplates": true
          }
        }
      `,

        'src/index.html': `
        <!DOCTYPE html>
        <html>
          <head>
            <base href="/">
            <title>Simple Angular App</title>
          </head>
          <body>
            <app-root></app-root>
          </body>
        </html>
      `,
      },
    },
    { preserveFiles: true }
  );

  it('should detect angular framework', async () => {
    expect(result.uiLibrary.name).toBe('angular');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
  });

  it('should detect angular router', async () => {
    expect(result.router.name).toBe('angularRouter');
    expect(result.router.confidence).toBeGreaterThanOrEqual(1);
  });

  it('should detect ngrx state management', async () => {
    expect(result.stateManagement.name).toBe('ngrx');
    expect(result.stateManagement.confidence).toBeGreaterThanOrEqual(1);
  });

  it('should detect webpack bundler', async () => {
    expect(result.bundler.name).toBe('webpack');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(1);
  });
});
