import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual-app/index.js';

describe('detects vite bundler with react basic usage', async () => {
  const result = await analyzeVirtualApp({
    outDir: 'dist',
    buildCommand: 'vite build',
    dependencies: {
      vite: 'latest',
      react: 'latest',
      '@vitejs/plugin-react': 'latest',
      'date-fns': 'latest',
      'react-dom': 'latest',
    },
    files: {
      'src/App.tsx': `
        import React, { useState, useEffect, Suspense, lazy } from 'react';
        import { createPortal } from 'react-dom';
        import { format, addDays, differenceInDays } from 'date-fns';

        // Lazy loaded component
        const LazyComponent = lazy(() => import('./LazyComponent'));

        function useDateCounter(initialDate = new Date()) {
          const [date, setDate] = useState(initialDate);
          const formattedDate = format(date, 'PP');

          return {
            date,
            formattedDate,
            addDay: () => setDate(d => addDays(d, 1)),
            subtractDay: () => setDate(d => addDays(d, -1)),
            getDaysSince: (compareDate: Date) => differenceInDays(date, compareDate)
          };
        }

        // Custom hook
        function useCounter(initialValue = 0) {
          const [count, setCount] = useState(initialValue);
          return {
            count,
            increment: () => setCount(c => c + 1),
            decrement: () => setCount(c => c - 1)
          };
        }

        // Main component using various React features
        export default function App() {
        const { formattedDate, addDay, subtractDay } = useDateCounter();
          const { count, increment, decrement } = useCounter(0);
          const [showPortal, setShowPortal] = useState(false);

          useEffect(() => {
            document.title = \`Count: \${count}\`;
          }, [count]);

          return (
            <div className="app">
              <h1>React Features Demo</h1>

              {/* Hooks demo */}
              <div>
                <button onClick={decrement}>-</button>
                <span>{count}</span>
                <button onClick={increment}>+</button>
              </div>

              {/* Portal demo */}
              <button onClick={() => setShowPortal(!showPortal)}>
                Toggle Portal
              </button>
              {showPortal && createPortal(
                <div>Portal Content</div>,
                document.body
              )}

              {/* Suspense/lazy loading demo */}
              <Suspense fallback={<div>Loading...</div>}>
                <LazyComponent />
              </Suspense>

              {/* Error boundary demo */}
              <ErrorBoundary>
                <div>Protected Content</div>
              </ErrorBoundary>
            </div>
          );
        }

        // Error Boundary component
        class ErrorBoundary extends React.Component {
          state = { hasError: false };

          static getDerivedStateFromError(error) {
            return { hasError: true };
          }

          componentDidCatch(error, errorInfo) {
            console.error('Error caught:', error, errorInfo);
          }

          render() {
            if (this.state.hasError) {
              return <div>Something went wrong.</div>;
            }
            return this.props.children;
          }
        }
      `,
      'src/LazyComponent.tsx': `
        import React from 'react';
        export default function LazyComponent() {
          return <div>Lazy Loaded Content</div>;
        }
      `,
      'src/main.tsx': `
        import React from 'react';
        import ReactDOM from 'react-dom/client';
        import App from './App';

        ReactDOM.createRoot(document.getElementById('root')!).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
      `,
      'index.html': `
        <!DOCTYPE html>
        <html>
          <head>
            <title>React + Vite Test</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.tsx"></script>
          </body>
        </html>
      `,
      'vite.config.ts': `
        import { defineConfig } from 'vite';
        import react from '@vitejs/plugin-react';

        export default defineConfig({
          plugins: [react()]
        });
      `,
    },
  }); // This will be the URL where test project is served

  it('detects vite bundler', async () => {
    expect(result.bundler.name).toBe('vite');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects react ui library', async () => {
    expect(result.uiLibrary.name).toBe('react');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects date-fns usage', async () => {
    expect(result.dates.name).toBe('dateFns');
    expect(result.dates.confidence).toBeGreaterThanOrEqual(1);
  });
});
