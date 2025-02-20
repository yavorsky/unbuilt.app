import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects next.js with react and moment.js', async () => {
  const result = await analyzeVirtualApp({
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
    },
    files: {
      'src/app/page.tsx': `
        'use client';

        import { useState, useEffect } from 'react';
        import moment from 'moment';

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
          const [date, setDate] = useState(new Date());
          const timeAgo = useTimeAgo(date);

          return (
            <main>
              <h1>Next.js with Moment Demo</h1>
              <div>
                <p>Current time: {moment().format('LLLL')}</p>
                <p>Time set: {timeAgo}</p>
                <button onClick={() => setDate(new Date())}>Update Time</button>
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
      'src/app/layout.tsx': `
        export default function RootLayout({
          children,
        }: {
          children: React.ReactNode
        }) {
          return (
            <html lang="en">
              <body>{children}</body>
            </html>
          )
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
  });

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
});
