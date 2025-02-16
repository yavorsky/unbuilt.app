// Checking for Vite, Vue, Vue Router, ESM and Dynamic imports

import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual-app/index.js';

describe('detects vue with code splitting', async () => {
  const result = await analyzeVirtualApp({
    outDir: 'dist',
    buildCommand: 'vite build',
    dependencies: {
      vue: 'latest',
      'vue-router': 'latest',
      '@vitejs/plugin-vue': 'latest',
      vite: 'latest',
      lodash: 'latest',
    },
    files: {
      'src/components/AsyncComponent.vue': `
        <script setup>
        import { ref } from 'vue'
        const count = ref(0)
        </script>

        <template>
          <div class="async">
            <h2>Async Component</h2>
            <button @click="count++">Count: {{ count }}</button>
          </div>
        </template>
      `,

      'src/features/heavy-calculation.ts': `
        // Simulating a heavy module
        import { chunk, sortBy, groupBy } from 'lodash'

        export function processData(data: number[]) {
          const chunks = chunk(data, 3)
          const sorted = sortBy(chunks, sum)
          return groupBy(sorted, 'length')
        }

        function sum(arr: number[]) {
          return arr.reduce((a, b) => a + b, 0)
        }
      `,

      'src/features/formatter.ts': `
        // Another feature module
        export function formatNumber(num: number) {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(num)
        }
      `,

      'src/pages/Home.vue': `
        <script setup>
        import { ref } from 'vue'

        const showAsync = ref(false)
        const AsyncComp = defineAsyncComponent(() =>
          import('../components/AsyncComponent.vue')
        )
        </script>

        <template>
          <div class="home">
            <h1>Home Page</h1>
            <button @click="showAsync = !showAsync">
              Toggle Async Component
            </button>
            <AsyncComp v-if="showAsync" />
          </div>
        </template>
      `,

      'src/pages/Calculator.vue': `
        <script setup>
        import { ref } from 'vue'

        const result = ref(null)

        async function runCalculation() {
          const { processData } = await import('../features/heavy-calculation')
          const data = Array.from({ length: 1000 }, (_, i) => i)
          result.value = processData(data)
        }
        </script>

        <template>
          <div class="calculator">
            <h1>Heavy Calculation Page</h1>
            <button @click="runCalculation">Run Calculation</button>
            <pre v-if="result">{{ result }}</pre>
          </div>
        </template>
      `,

      'src/pages/Formatter.vue': `
        <script setup>
        import { ref } from 'vue'

        const formattedValue = ref('')

        async function formatValue() {
          const { formatNumber } = await import('../features/formatter')
          formattedValue.value = formatNumber(1234.56)
        }
        </script>

        <template>
          <div class="formatter">
            <h1>Formatter Page</h1>
            <button @click="formatValue">Format Number</button>
            <p>{{ formattedValue }}</p>
          </div>
        </template>
      `,

      'src/router.ts': `
        import { createRouter, createWebHistory } from 'vue-router'

        const routes = [
          {
            path: '/',
            component: () => import('./pages/Home.vue')
          },
          {
            path: '/calculator',
            component: () => import('./pages/Calculator.vue')
          },
          {
            path: '/formatter',
            component: () => import('./pages/Formatter.vue')
          }
        ]

        export const router = createRouter({
          history: createWebHistory(),
          routes
        })
      `,

      'src/App.vue': `
        <script setup>
        import { ref } from 'vue'

        const currentTab = ref('home')
        </script>

        <template>
          <main>
            <nav>
              <router-link to="/">Home</router-link> |
              <router-link to="/calculator">Calculator</router-link> |
              <router-link to="/formatter">Formatter</router-link>
            </nav>

            <router-view></router-view>
          </main>
        </template>
      `,

      'src/main.ts': `
        import { createApp } from 'vue'
        import App from './App.vue'
        import { router } from './router'

        const app = createApp(App)
        app.use(router)
        app.mount('#app')
      `,

      'index.html': `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vue Code Splitting Demo</title>
          </head>
          <body>
            <div id="app"></div>
            <script type="module" src="/src/main.ts"></script>
          </body>
        </html>
      `,

      'vite.config.ts': `
        import { defineConfig } from 'vite';
        import vue from '@vitejs/plugin-vue';

        export default defineConfig({
          plugins: [vue()],
          build: {
            rollupOptions: {
              output: {
                manualChunks: {
                  'vendor': ['vue', 'vue-router'],
                  'lodash': ['lodash'],
                }
              }
            }
          }
        });
      `,
    },
  });

  it('detects vue framework and ui library', async () => {
    expect(result.uiLibrary.name).toBe('vue');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects vite bundler with code splitting', async () => {
    expect(result.bundler.name).toBe('vite');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(1);
    // Check for code splitting patterns in secondary matches
    // Vite is based on Rollup, so we'll hae some confidence in the match
    expect(result.bundler.secondaryMatches?.rollup?.confidence).toBeGreaterThan(
      0.5
    );
  });

  it('detects vue router usage', async () => {
    expect(result.router.name).toBe('vueRouter');
    expect(result.router.confidence).toBeGreaterThanOrEqual(1);
    expect(Object.values(result.router.secondaryMatches ?? {}).length).toBe(0);
  });

  it('detects modules system usage', async () => {
    expect(result.modules.name).toBe('esm');
    expect(result?.modules.confidence).toBeGreaterThanOrEqual(1);
  });
});
