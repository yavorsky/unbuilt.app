import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects Astro with Vue, Pinia and date-fns', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: 'dist',
      buildCommand: 'astro build',
      env: {
        ASTRO_TELEMETRY_DISABLED: 'true',
      },
      dependencies: {
        '@astrojs/vue': '^4.0.8',
        '@astrojs/tailwind': '^5.1.0',
        '@vueuse/core': '^10.7.2',
        astro: '^4.5.0',
        vue: '^3.4.15',
        pinia: '^2.1.7',
        'date-fns': '^3.3.1',
        tailwindcss: '^3.4.1',
        typescript: '^5.3.3',
      },
      files: {
        'src/pinia.js': `
        import { createPinia } from 'pinia';

        // Create a single pinia instance for the app
        export const pinia = createPinia();
        `,
        'astro.config.mjs': `
        import { defineConfig } from 'astro/config';
        import vue from '@astrojs/vue';
        import tailwind from '@astrojs/tailwind';

        export default defineConfig({
          integrations: [vue(), tailwind()],
          site: 'https://example.com',
        });
        `,
        'src/store/dateStore.js': `
        import { defineStore } from 'pinia';
        import { format, addDays } from 'date-fns';

        export const useDateStore = defineStore('date', {
          state: () => ({
            currentDate: new Date(),
            formattedDate: format(new Date(), 'PPP'),
            updateCount: 0,
          }),

          actions: {
            updateDate() {
              this.currentDate = addDays(this.currentDate, 1);
              this.formattedDate = format(this.currentDate, 'PPP');
              this.updateCount++;
            },
            resetDate() {
              this.currentDate = new Date();
              this.formattedDate = format(this.currentDate, 'PPP');
            }
          },

          getters: {
            dateDetails: (state) => ({
              day: format(state.currentDate, 'EEEE'),
              month: format(state.currentDate, 'MMMM'),
              year: format(state.currentDate, 'yyyy'),
            }),
          }
        });
        `,
        'src/components/DateDisplay.vue': `
        <script setup>
        import { createPinia, setActivePinia } from 'pinia';
        import { useDateStore } from '../store/dateStore';
        import { format, formatDistance } from 'date-fns';

        // Initialize Pinia for this component
        const pinia = createPinia();
        setActivePinia(pinia);
        const dateStore = useDateStore();
        </script>

        <template>
          <div class="date-container p-4 bg-gray-100 rounded-lg">
            <h2 class="text-xl font-bold mb-4">Date Information</h2>

            <div class="date-info mb-4">
              <p>Current date: {{ dateStore.formattedDate }}</p>
              <p>Day of week: {{ dateStore.dateDetails.day }}</p>
              <p>Time since last update: {{ formatDistance(dateStore.currentDate, new Date(), { addSuffix: true }) }}</p>
              <p>Update count: {{ dateStore.updateCount }}</p>
            </div>

            <div class="date-formats mb-4">
              <h3 class="text-lg font-semibold">Formatting Examples:</h3>
              <ul class="ml-4">
                <li>ISO: {{ format(dateStore.currentDate, 'yyyy-MM-dd') }}</li>
                <li>US: {{ format(dateStore.currentDate, 'MM/dd/yyyy') }}</li>
                <li>EU: {{ format(dateStore.currentDate, 'dd.MM.yyyy') }}</li>
                <li>Full: {{ format(dateStore.currentDate, 'PPPP') }}</li>
              </ul>
            </div>

            <div class="actions">
              <button
                @click="dateStore.updateDate()"
                class="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
              >
                Add One Day
              </button>
              <button
                @click="dateStore.resetDate()"
                class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Reset Date
              </button>
            </div>
          </div>
        </template>
        `,
        'src/pages/index.astro': `
        ---
        import Layout from '../layouts/Layout.astro';
        import DateDisplay from '../components/DateDisplay.vue';
        ---

        <Layout title="Astro Date Demo">
          <main class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-6">Astro with Vue, Pinia and date-fns</h1>
            <DateDisplay client:load />
          </main>
        </Layout>

        <script>
          import { createPinia } from 'pinia';
          import { createApp } from 'vue';

          // Create a new app instance for Pinia setup
          const app = createApp({});
          const pinia = createPinia();
          app.use(pinia);
        </script>
        `,
        'src/layouts/Layout.astro': `
        ---
        interface Props {
          title: string;
        }

        const { title } = Astro.props;
        ---

        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <meta name="generator" content={Astro.generator} />
            <title>{title}</title>
          </head>
          <body>
            <slot />
          </body>
        </html>
        `,
        'tsconfig.json': `
        {
          "extends": "astro/tsconfigs/strict",
          "compilerOptions": {
            "jsx": "preserve",
            "jsxImportSource": "vue",
            "types": ["vite/client"],
            "baseUrl": ".",
            "paths": {
              "@components/*": ["src/components/*"],
              "@layouts/*": ["src/layouts/*"],
              "@store/*": ["src/store/*"]
            }
          }
        }
        `,
        'tailwind.config.cjs': `
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
          theme: {
            extend: {},
          },
          plugins: [],
        }
        `,
      },
    },
    { preserveFiles: true }
  );

  it('detects Astro framework', async () => {
    expect(result.framework.name).toBe('astro');
    expect(result.framework.confidence).toBeGreaterThanOrEqual(1);
    expect(result.framework.secondaryMatches).toEqual({});
  });

  it('detects Vue UI library', async () => {
    expect(result.uiLibrary.name).toBe('vue');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
    expect(result.uiLibrary.secondaryMatches).toEqual({});
  });

  it('detects date-fns usage', async () => {
    expect(result.dates.name).toBe('dateFns');
    expect(result.dates.confidence).toBeGreaterThanOrEqual(1);
    expect(result.dates.secondaryMatches).toEqual({});
  });

  it('detects Pinia state management', async () => {
    expect(result.stateManagement.name).toBe('pinia');
    expect(result.stateManagement.confidence).toBeGreaterThanOrEqual(1);
    expect(result.stateManagement.secondaryMatches).toEqual({});
  });

  it('detects Tailwind CSS usage', async () => {
    expect(result.stylingLibraries.items.tailwindCSS).toBeTruthy();
    expect(
      result.stylingLibraries.items.tailwindCSS.confidence
    ).toBeGreaterThanOrEqual(1);
  });
});
