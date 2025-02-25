import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects vitepress, vitepress router with vue and pinia', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: '.vitepress/dist',
      buildCommand: 'vitepress build',
      dependencies: {
        vitepress: '1.6.3',
        vue: '3.4.15',
        pinia: '2.1.7',
      },
      packageJson: {
        type: 'module',
      },
      files: {
        '.vitepress/config.js': `
        export default {
          title: 'VitePress Demo',
          description: 'A VitePress site with Vue and Pinia'
        }
      `,
        '.vitepress/theme/index.js': `
        import DefaultTheme from 'vitepress/theme'
        import { createPinia } from 'pinia'

        export default {
          ...DefaultTheme,
          enhanceApp({ app }) {
            app.use(createPinia())
          }
        }
      `,
        '.vitepress/theme/Counter.vue': `
        <template>
          <div class="counter">
            <p>Count: {{ store.count }}</p>
            <button @click="store.increment">Increment</button>
          </div>
        </template>

        <script setup>
        import { useCounterStore } from './store'

        const store = useCounterStore()
        </script>

        <style>
        .counter {
          border: 1px solid #ccc;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        </style>
      `,
        'index.md': `
        ---
        layout: home
        ---

        # VitePress with Pinia

        This is a simple VitePress site demonstrating Pinia integration.

        <ClientOnly>
          <Counter />
        </ClientOnly>

        <script setup>
        import Counter from './.vitepress/theme/Counter.vue'
        </script>
      `,
      },
    },
    { preserveFiles: true }
  );

  it('detects vitepress framework', async () => {
    expect(result.framework.name).toBe('vitepress');
    expect(result.framework.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.framework.secondaryMatches).toEqual({});
  });

  it('detects vue ui library', async () => {
    expect(result.uiLibrary.name).toBe('vue');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.uiLibrary.secondaryMatches).toEqual({});
  });

  it('detects vitepress router solition', async () => {
    expect(result.router.name).toBe('vitepressRouter');
    expect(result.router.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.router.secondaryMatches).toEqual({});
  });

  it('detects pinia state management', async () => {
    expect(result.stateManagement.name).toBe('pinia');
    expect(result.stateManagement.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result.stateManagement.secondaryMatches).toEqual({});
  });

  it('detects vite bundler', async () => {
    expect(result.bundler.name).toBe('vite');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(0.8);
  });
});
