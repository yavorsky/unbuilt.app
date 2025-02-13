import { expect, test } from 'vitest';
import { initDetectionTest } from '../../utils/init.js';

test('detects vite with react basic usage', async () => {
  const result = await initDetectionTest({
    outDir: 'dist',
    buildCommand: 'vite build',
    dependencies: {
      vite: 'latest',
      react: 'latest',
      '@vitejs/plugin-react': 'latest',
      'react-dom': 'latest',
    },
    files: {
      'src/App.tsx': `
        import React, { useState, useEffect, Suspense, lazy } from 'react';
        import { createPortal } from 'react-dom';

        // Lazy loaded component
        const LazyComponent = lazy(() => import('./LazyComponent'));

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

  expect(result?.analysis.uiLibrary.name).toBe('react');
  expect(result?.analysis.bundler.name).toBe('vite');
});
