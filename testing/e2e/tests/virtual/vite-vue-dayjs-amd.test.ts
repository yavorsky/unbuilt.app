// testing/e2e/tests/vue-dayjs.test.ts
import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects vue with day.js', async () => {
  const result = await analyzeVirtualApp({
    outDir: 'dist',
    buildCommand: 'vite build',
    dependencies: {
      vue: '3.5.13',
      dayjs: '1.11.13',
      '@vitejs/plugin-vue': '5.2.1',
      vite: '6.1.1',
    },
    files: {
      'src/components/DateDisplay.vue': `
        <script setup>
        import { computed } from 'vue'
        import dayjs from 'dayjs'

        const props = defineProps({
          date: {
            type: Object,
            required: true
          },
          format: {
            type: String,
            default: 'LLLL'
          }
        })

        const formattedDate = computed(() => props.date.format(props.format))
        </script>

        <template>
          <div class="date-display">
            {{ formattedDate }}
          </div>
        </template>

        <style scoped>
        .date-display {
          font-family: monospace;
          padding: 4px 8px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        </style>
      `,

      'src/components/TimeAgo.vue': `
        <script setup>
        import { computed } from 'vue'
        import dayjs from 'dayjs'

        const props = defineProps({
          date: {
            type: Object,
            required: true
          }
        })

        const timeAgo = computed(() => props.date.fromNow())
        </script>

        <template>
          <span class="time-ago">{{ timeAgo }}</span>
        </template>

        <style scoped>
        .time-ago {
          color: #666;
          font-style: italic;
        }
        </style>
      `,

      'src/components/DatePicker.vue': `
        <script setup>
        import { ref } from 'vue'
        import dayjs from 'dayjs'

        const emit = defineEmits(['update'])

        const selectedDate = ref(dayjs())

        function updateDate(days) {
          selectedDate.value = dayjs().add(days, 'day')
          emit('update', selectedDate.value)
        }
        </script>

        <template>
          <div class="date-picker">
            <button @click="updateDate(-1)">Yesterday</button>
            <button @click="updateDate(0)">Today</button>
            <button @click="updateDate(1)">Tomorrow</button>
          </div>
        </template>

        <style scoped>
        .date-picker {
          display: flex;
          gap: 8px;
        }
        button {
          background: #42b883;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background: #3aa776;
        }
        </style>
      `,

      'src/App.vue': `
        <script setup>
        import { ref, onMounted, onUnmounted } from 'vue'
        import dayjs from 'dayjs'
        import relativeTime from 'dayjs/plugin/relativeTime'
        import localizedFormat from 'dayjs/plugin/localizedFormat'
        import calendar from 'dayjs/plugin/calendar'
        import DateDisplay from './components/DateDisplay.vue'
        import TimeAgo from './components/TimeAgo.vue'
        import DatePicker from './components/DatePicker.vue'
        import { formatString } from './helpers'

        dayjs.extend(relativeTime)
        dayjs.extend(localizedFormat)
        dayjs.extend(calendar)

        const now = ref(dayjs())
        const selectedDate = ref(dayjs())
        let timer

        onMounted(() => {
          timer = setInterval(() => {
            now.value = dayjs()
          }, 1000)
        })

        onUnmounted(() => {
          clearInterval(timer)
        })

        console.log(formatString('hello'))

        function handleDateUpdate(newDate) {
          selectedDate.value = newDate
        }
        </script>

        <template>
          <main>
            <h1>Vue with Day.js Demo</h1>

            <div class="date-demo">
              <h2>Current Time</h2>
              <DateDisplay :date="now" />
              <TimeAgo :date="now" />

              <h2>Date Selection</h2>
              <DatePicker @update="handleDateUpdate" />

              <div class="selected-date">
                <h3>Selected Date:</h3>
                <DateDisplay :date="selectedDate" format="LL" />
                <TimeAgo :date="selectedDate" />
              </div>

              <h2>Date Formatting Examples</h2>
              <ul>
                <li>Short: <DateDisplay :date="now" format="L" /></li>
                <li>Long: <DateDisplay :date="now" format="LL" /></li>
                <li>With Time: <DateDisplay :date="now" format="LLL" /></li>
                <li>Calendar: {{ now.calendar() }}</li>
              </ul>

              <!-- Vue-specific features -->
              <h2>Vue Features Demo</h2>
              <div v-if="now.isAfter(selectedDate)" class="feature">
                Selected time is in the past
              </div>
              <div v-else-if="now.isBefore(selectedDate)" class="feature">
                Selected time is in the future
              </div>
              <div class="computed">
                Hour of day: {{ now.hour() }}
              </div>
            </div>
          </main>
        </template>

        <style scoped>
        .date-demo {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 20px;
        }

        .selected-date {
          margin: 20px 0;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .feature {
          margin-top: 8px;
          padding: 8px;
          background: #e8f5e9;
          border-radius: 4px;
        }
        </style>
      `,

      'src/main.ts': `
        import { createApp } from 'vue'
        import App from './App.vue'

        createApp(App).mount('#app')
      `,

      'src/helpers.ts': `
        export function formatString(str: string) {
          return str + 'formatted :)'
        }
      `,

      'index.html': `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vue + Day.js Demo</title>
          </head>
          <body>
            <div id="app"></div>
            <script type="module" src="/src/main.js"></script>
          </body>
        </html>
      `,

      'vite.config.ts': `
        import { defineConfig } from 'vite';
        import vue from '@vitejs/plugin-vue';

        export default defineConfig({
          plugins: [vue()],
        });
      `,
    },
  });

  it('detects vue ui library', async () => {
    expect(result.uiLibrary.name).toBe('vue');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects day.js usage', async () => {
    expect(result.dates.name).toBe('dayJs');
    expect(result.dates.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects vite bundler', async () => {
    expect(result.bundler.name).toBe('vite');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects modules system usage', async () => {
    expect(result.modules.name).toBe('amd');
    expect(result.modules.confidence).toBeGreaterThanOrEqual(1);
  });
});
