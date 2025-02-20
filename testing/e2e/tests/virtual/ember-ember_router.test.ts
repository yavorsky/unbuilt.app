// testing/e2e/tests/ember-app.test.ts
import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects Ember.js in a basic app', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: 'dist',
      buildCommand: 'ember build --environment=production',
      dependencies: {
        'ember-source': '4.12.0',
        'ember-cli': '4.12.0',
        'ember-data': '4.12.0',
        '@glimmer/component': '1.1.2',
        '@glimmer/tracking': '1.1.2',
        '@ember/optional-features': '2.2.0',
        'ember-cli-babel': '7.26.11',
        'ember-cli-htmlbars': '6.3.0',
        'ember-resolver': '10.1.1',
        'ember-load-initializers': '2.1.2',
        'ember-auto-import': '2.6.3',
        '@ember/test-helpers': '2.9.3',
        '@ember-data/model': '4.12.0',
        '@ember-data/store': '4.12.0',
        'loader.js': '4.7.0',
        'ember-cli-app-version': '5.0.0',
        'ember-cli-dependency-checker': '3.3.2',
      },
      packageJson: {
        name: 'my-app',
        ember: {
          edition: 'octane',
        },
      },
      files: {
        'config/optional-features.json': `{
        "application-template-wrapper": false,
        "default-async-observers": true,
        "jquery-integration": false,
        "template-only-glimmer-components": true
      }`,
        'app/styles/app.css': `
        body {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
        }

        .post-list {
          padding: 20px;
        }

        .post {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .post.selected {
          background-color: #f0f0f0;
        }
        `,
        'app/index.html': `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>MyEmberApp</title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width, initial-scale=1">

            {{content-for "head"}}

            <link integrity="" rel="stylesheet" href="{{rootURL}}assets/vendor.css">
            <link integrity="" rel="stylesheet" href="{{rootURL}}assets/my-app.css">

            {{content-for "head-footer"}}
          </head>
          <body>
            {{content-for "body"}}

            <div id="ember-basic-dropdown-wormhole"></div>

            <script src="{{rootURL}}assets/vendor.js"></script>
            <script src="{{rootURL}}assets/my-app.js"></script>

            {{content-for "body-footer"}}
          </body>
        </html>`,
        'ember-cli-build.js': `
        'use strict';

        const EmberApp = require('ember-cli/lib/broccoli/ember-app');

        module.exports = function (defaults) {
          const app = new EmberApp(defaults, {
            'ember-cli-babel': {
              includePolyfill: true
            }
          });

          return app.toTree();
        };
      `,

        'app/app.js': `
        import Application from '@ember/application';
        import Resolver from 'ember-resolver';
        import loadInitializers from 'ember-load-initializers';
        import config from './config/environment';

        export default class App extends Application {
          modulePrefix = config.modulePrefix;
          podModulePrefix = config.podModulePrefix;
          Resolver = Resolver;
        }

        loadInitializers(App, config.modulePrefix);
      `,

        'app/router.js': `
        import EmberRouter from '@ember/routing/router';
        import config from './config/environment';

        export default class Router extends EmberRouter {
          location = config.locationType;
          rootURL = config.rootURL;
        }

        Router.map(function() {
          this.route('about');
          this.route('posts', function() {
            this.route('new');
            this.route('edit', { path: '/:post_id/edit' });
          });
        });
      `,

        'app/routes/index.js': `
        import Route from '@ember/routing/route';

        export default class IndexRoute extends Route {
          model() {
            return {
              posts: [
                { id: '1', title: 'Test Post', excerpt: 'Test Content' }
              ]
            };
          }
        }
      `,
        'app/components/.gitkeep': '',

        'app/templates/application.hbs': `
        <div class="post-list">
          <h1>Welcome to Ember</h1>
          {{outlet}}
        </div>
      `,

        'app/templates/index.hbs': `
        <div class="posts">
          {{#each @model.posts as |post|}}
            <article class="post">
              <h2>{{post.title}}</h2>
              <p>{{post.excerpt}}</p>
            </article>
          {{/each}}
        </div>
      `,

        'app/models/post.js': `
        import Model, { attr } from '@ember-data/model';

        export default class PostModel extends Model {
          @attr('string') title;
          @attr('string') content;
          @attr('date') publishedAt;
        }
      `,

        'config/environment.js': `
        'use strict';

        module.exports = function(environment) {
          let ENV = {
            modulePrefix: 'my-app',
            environment,
            rootURL: '/',
            locationType: 'history',
            EmberENV: {
              FEATURES: {},
              EXTEND_PROTOTYPES: {
                Date: false
              }
            },
            APP: {}
          };

          return ENV;
        };
      `,

        '.ember-cli': `
        {
          "disableAnalytics": false,
          "ssl": false
        }
      `,
      },
    },
    { preserveFiles: true }
  );

  it('should detect Ember as the framework', async () => {
    expect(result.uiLibrary.name).toBe('ember');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
  });
});
