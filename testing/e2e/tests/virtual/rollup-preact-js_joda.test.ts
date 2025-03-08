// testing/e2e/tests/rollup-modern-stack.test.ts
import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects rollup with modern libraries stack', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: 'dist',
      buildCommand: 'rollup -c',
      dependencies: {
        preact: '10.26.2',
        'preact-hooks': 'latest',
        '@js-joda/core': '5.6.4',
        rollup: '4.34.8',
        '@rollup/plugin-node-resolve': '16.0.0 ',
        '@rollup/plugin-typescript': '12.1.2',
        '@rollup/plugin-terser': '0.4.4',
        '@rollup/plugin-html': '2.0.0',
        typescript: '5.7.3',
        tslib: '2.8.1',
      },
      packageJson: {
        type: 'module',
      },
      files: {
        'src/App.tsx': `
        import { h } from 'preact';
        import { useState, useEffect } from 'preact/hooks';
        import { LocalDateTime, DateTimeFormatter } from '@js-joda/core';

        export function App() {
          const [count, setCount] = useState(0);
          const [currentTime, setCurrentTime] = useState('');
          const [futureTime, setFutureTime] = useState('');

          useEffect(() => {
            // JS-Joda usage examples
            const now = LocalDateTime.now();
            const formatter = DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm:ss');
            setCurrentTime(now.format(formatter));

            // Future date calculation
            const future = now.plusDays(7).plusHours(3);
            setFutureTime(future.format(formatter));
          }, []);

          return (
            <div>
              <h1>Count: {count}</h1>
              <button onClick={() => setCount(count + 1)}>
                Increment
              </button>
              <div>
                <p>Current time: {currentTime}</p>
                <p>Time in 7 days and 3 hours: {futureTime}</p>
              </div>
            </div>
          );
        }
      `,

        'src/index.tsx': `
        import { h, render } from 'preact';
        import { App } from './App';

        const root = document.createElement('div');
        document.body.appendChild(root);
        render(<App />, root);
      `,

        'rollup.config.js': `
          import resolve from '@rollup/plugin-node-resolve';
          import typescript from '@rollup/plugin-typescript';
          import terser from '@rollup/plugin-terser';
          import html from '@rollup/plugin-html';

          export default {
            input: 'src/index.tsx',
            output: {
              dir: 'dist',
              format: 'esm',
              sourcemap: true,
              manualChunks: {
                'js-joda': ['@js-joda/core'],
                'preact': ['preact', 'preact/hooks'],
              },
            },
            plugins: [
              resolve(),
              typescript(),
              terser(),
              html({
                title: 'Preact App',
                template: ({ files, title }) => \`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <title>\${title}</title>
                    </head>
                    <body>
                      \${files.js
                        .map(({ fileName }) => \`<script type="module" src="\${fileName}"></script>\`)
                        .join('\\n')}
                    </body>
                  </html>
                \`
              })
            ]
          };
        `,

        'tsconfig.json': `
        {
          "compilerOptions": {
            "target": "es2020",
            "module": "esnext",
            "moduleResolution": "node",
            "esModuleInterop": true,
            "strict": true,
            "skipLibCheck": true,
            "jsx": "react-jsx",
            "jsxImportSource": "preact"
          },
          "include": ["src"]
        }
      `,
      },
    },
    { preserveFiles: true }
  );

  it('detects rollup bundler', async () => {
    expect(result.bundler.name).toBe('rollup');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects preact', async () => {
    expect(result.uiLibrary.name).toBe('preact');
    // We need to imporve preact patterns. For now, we can't increase score to prevent false positives for other patterns.
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('detects js-joda', async () => {
    expect(result.dates.name).toBe('jsJoda');
    expect(result.dates.confidence).toBeGreaterThanOrEqual(1);
  });
});
