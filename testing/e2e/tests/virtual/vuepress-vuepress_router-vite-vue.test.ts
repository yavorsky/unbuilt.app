import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';
import { omit } from 'lodash-es';

describe('detects vuepress, vuepress router with vue', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: '.vuepress/dist',
      buildCommand: 'vuepress build',
      dependencies: {
        vuepress: '1.9.7',
        vue: '2.6.14',
        'vue-template-compiler': '2.6.14',
        'vue-server-renderer': '2.6.14',
      },
      packageJson: {
        type: 'commonjs',
      },
      files: {
        '.vuepress/config.js': `
        module.exports = {
          title: 'VuePress Demo',
          description: 'A VuePress site with Vue components',
          themeConfig: {
            nav: [
              { text: 'Home', link: '/' },
              { text: 'Guide', link: '/guide/' }
            ],
            sidebar: 'auto'
          },
        }
      `,
        '.vuepress/enhanceApp.js': `
        // Global state management
        const store = {
          count: 0
        }

        export default ({ Vue }) => {
          // Add a simple store to Vue prototype
          Vue.prototype.$store = store

          // Register a global mixin to make store reactive
          Vue.mixin({
            computed: {
              count: {
                get: () => store.count,
                set: (val) => { store.count = val }
              }
            },
            methods: {
              increment() {
                store.count++
              },
              decrement() {
                if (store.count > 0) store.count--
              }
            }
          })
        }
      `,
        '.vuepress/components/Counter.vue': `
        <template>
          <div class="counter">
            <h3>{{ title }}</h3>
            <div class="display">{{ count }}</div>
            <div class="buttons">
              <button @click="increment">+</button>
              <button @click="decrement">-</button>
            </div>
          </div>
        </template>

        <script>
        export default {
          props: {
            title: {
              type: String,
              default: 'Counter'
            }
          }
        }
        </script>

        <style>
        .counter {
          border: 2px solid #3eaf7c;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
        .counter .display {
          font-size: 2rem;
          font-weight: bold;
          margin: 10px 0;
        }
        .counter .buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .counter button {
          width: 40px;
          height: 40px;
          font-size: 1.2rem;
          background-color: #3eaf7c;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }
        </style>
      `,
        'README.md': `
        # VuePress with Vue Components

        This example demonstrates Vue components in VuePress.

        <ClientOnly>
          <Counter title="Home Page Counter" />
          <p>The counter state is shared between pages!</p>
        </ClientOnly>

        ## Features

        - Vue components integration
        - Shared state between pages
        - VuePress router navigation
      `,
        'guide/README.md': `
        # Guide Page

        This page shows how the counter state persists between pages.

        <ClientOnly>
          <Counter title="Guide Page Counter" />
          <p>This counter shares state with the counter on the home page.</p>
        </ClientOnly>

        ## How It Works

        VuePress uses Vue under the hood, allowing us to:

        - Use Vue components in markdown
        - Share state between pages
        - Navigate using VuePress router
      `,
      },
    },
    { preserveFiles: true }
  );

  it('detects vuepress framework', async () => {
    expect(result.framework.name).toBe('vuepress');
    expect(result.framework.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.framework.secondaryMatches).toEqual({});
  });

  it('detects vue ui library', async () => {
    expect(result.uiLibrary.name).toBe('vue');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.uiLibrary.secondaryMatches).toEqual({});
  });

  it('detects vuepress router solution', async () => {
    expect(result.router.name).toBe('vuepressRouter');
    expect(result.router.confidence).toBeGreaterThanOrEqual(0.8);
    expect(
      result.router.secondaryMatches.vueRouter?.confidence
    ).toBeGreaterThanOrEqual(0.5);
    expect(omit(result.router.secondaryMatches, ['vueRouter'])).toEqual({});
  });

  it('detects webpack bundler', async () => {
    expect(result.bundler.name).toBe('webpack');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(0.8);
  });
});
