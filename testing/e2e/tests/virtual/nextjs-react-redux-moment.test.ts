import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects next.js with react, redux and moment.js', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: '.next',
      buildCommand: 'next build',
      startCommand: 'next start',
      env: {
        NEXT_DEBUG: 'true',
      },
      dependencies: {
        '@types/react': '19.0.10',
        '@types/node': '22.13.4',
        next: '15.1.7',
        react: '19.0.0',
        typescript: '5.7.3',
        'react-dom': '19.0.0',
        moment: '2.30.1',
        '@reduxjs/toolkit': '^2.0.1',
        'react-redux': '^9.0.4',
      },
      files: {
        'src/store/timeSlice.ts': `
        import { createSlice, PayloadAction } from '@reduxjs/toolkit';

        interface TimeState {
          lastUpdate: string;
          count: number;
        }

        const initialState: TimeState = {
          lastUpdate: new Date().toISOString(),
          count: 0,
        };

        export const timeSlice = createSlice({
          name: 'time',
          initialState,
          reducers: {
            updateTime: (state) => {
              state.lastUpdate = new Date().toISOString();
              state.count += 1;
            },
          },
        });

        export const { updateTime } = timeSlice.actions;
        export default timeSlice.reducer;
      `,
        'src/store/store.ts': `
        import { configureStore } from '@reduxjs/toolkit';
        import timeReducer from './timeSlice';

        export const store = configureStore({
          reducer: {
            time: timeReducer,
          },
        });

        export type RootState = ReturnType<typeof store.getState>;
        export type AppDispatch = typeof store.dispatch;
      `,
        'src/app/layout.tsx': `
        'use client';

        import { Provider } from 'react-redux';
        import { store } from '../store/store';

        export default function RootLayout({
          children,
        }: {
          children: React.ReactNode
        }) {
          return (
            <html lang="en">
              <body>
                <Provider store={store}>
                  {children}
                </Provider>
              </body>
            </html>
          )
        }
      `,
        'src/app/page.tsx': `
        'use client';

        import { useState, useEffect } from 'react';
        import { useDispatch, useSelector } from 'react-redux';
        import moment from 'moment';
        import { updateTime } from '../store/timeSlice';
        import type { RootState } from '../store/store';

        moment.locale('en-US');

        function useTimeAgo(date: Date) {
          const [timeAgo, setTimeAgo] = useState(moment(date).fromNow());

          useEffect(() => {
            const timer = setInterval(() => {
              setTimeAgo(moment(date).fromNow());
            }, 1000);

            return () => clearInterval(timer);
          }, [date]);

          return timeAgo;
        }

        export default function Home() {
          const dispatch = useDispatch();
          const { lastUpdate, count } = useSelector((state: RootState) => state.time);
          const [date, setDate] = useState(new Date());
          const timeAgo = useTimeAgo(date);

          const handleUpdateTime = () => {
            setDate(new Date());
            dispatch(updateTime());
          };

          return (
            <main>
              <h1>Next.js with Moment and Redux Demo</h1>
              <div>
                <p>Current time: {moment().format('LLLL')}</p>
                <p>Time set: {timeAgo}</p>
                <p>Times updated: {count}</p>
                <p>Last Redux update: {moment(lastUpdate).format('LLLL')}</p>
                <button onClick={handleUpdateTime}>Update Time</button>
              </div>

              <div>
                <h2>Date Formatting Examples</h2>
                <ul>
                  <li>Short: {moment().format('L')}</li>
                  <li>Long: {moment().format('LL')}</li>
                  <li>With Time: {moment().format('LLL')}</li>
                  <li>Calendar: {moment().calendar()}</li>
                </ul>
              </div>
            </main>
          );
        }
      `,
        'next.config.js': `
        /** @type {import('next').NextConfig} */
        const nextConfig = {}
        module.exports = nextConfig
      `,
        'tsconfig.json': `
        {
          "compilerOptions": {
            "target": "es5",
            "lib": ["dom", "dom.iterable", "esnext"],
            "allowJs": true,
            "skipLibCheck": true,
            "strict": true,
            "forceConsistentCasingInFileNames": true,
            "noEmit": true,
            "esModuleInterop": true,
            "module": "esnext",
            "moduleResolution": "node",
            "resolveJsonModule": true,
            "isolatedModules": true,
            "jsx": "preserve",
            "incremental": true,
            "plugins": [
              {
                "name": "next"
              }
            ]
          },
          "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
          "exclude": ["node_modules"]
        }
      `,
      },
    },
    { preserveFiles: true }
  );

  it('detects next.js framework', async () => {
    expect(result.framework.name).toBe('next');
    expect(result.framework.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects react ui library', async () => {
    expect(result.uiLibrary.name).toBe('react');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects moment.js usage', async () => {
    expect(result.dates.name).toBe('moment');
    expect(result.dates.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects redux usage', async () => {
    expect(result.stateManagement.name).toBe('redux');
    expect(result.stateManagement.confidence).toBeGreaterThanOrEqual(1);
  });
});
