import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects next.js with open telemetry monitoring', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: '.next',
      buildCommand: 'next build',
      startCommand: 'next start',
      env: {
        NEXT_DEBUG: 'true',
        NEXT_OTEL_API_KEY: 'test-key-123',
      },
      dependencies: {
        '@types/react': '19.0.10',
        '@types/node': '22.13.4',
        next: '15.1.7',
        react: '19.0.0',
        typescript: '5.7.3',
        'react-dom': '19.0.0',
        '@opentelemetry/api': '^1.8.0',
        '@opentelemetry/resources': '^1.22.0',
        '@opentelemetry/sdk-trace-web': '^1.22.0',
        '@opentelemetry/exporter-trace-otlp-http': '^0.49.1',
        '@opentelemetry/context-zone': '^1.22.0',
        '@vercel/otel': '^1.11.0',
      },
      files: {
        'src/instrumentation.ts': `
        // This file is for Next.js instrumentation
        // https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

        export async function register() {
          // Skip if not in browser
          if (typeof window === 'undefined') return;

          // Initialize OpenTelemetry
          const { trace } = await import('@opentelemetry/api');
          const { WebTracerProvider } = await import('@opentelemetry/sdk-trace-web');
          const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
          const { BatchSpanProcessor } = await import('@opentelemetry/sdk-trace-base');
          const { ZoneContextManager } = await import('@opentelemetry/context-zone');
          const { Resource } = await import('@opentelemetry/resources');
          const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');

          const provider = new WebTracerProvider({
            resource: new Resource({
              [SemanticResourceAttributes.SERVICE_NAME]: 'next-application',
              [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
            }),
          });

          // Use OTLP exporter
          const exporter = new OTLPTraceExporter({
            url: 'https://api.example.com/v1/traces',
            headers: {
              'api-key': process.env.NEXT_OTEL_API_KEY || 'default-key',
            },
          });

          provider.addSpanProcessor(new BatchSpanProcessor(exporter));
          provider.register({
            contextManager: new ZoneContextManager(),
          });

          // Create tracer
          const tracer = trace.getTracer('next-app-tracer');

          // Custom spans for page navigation
          if (typeof window !== 'undefined') {
            const originalPushState = history.pushState;
            history.pushState = function(state, title, url) {
              const span = tracer.startSpan('navigation.pushState');
              try {
                return originalPushState.apply(this, [state, title, url]);
              } finally {
                span.end();
              }
            };
          }
        }
        `,
        'src/app/layout.tsx': `
        'use client';

        export default function RootLayout({
          children,
        }: {
          children: React.ReactNode
        }) {
          return (
            <html lang="en">
              <body>
                {children}
              </body>
            </html>
          );
        }
        `,
        'src/app/page.tsx': `
        'use client';

        import { trace } from '@opentelemetry/api';

        export default function Home() {
          const handleClick = () => {
            // Create a custom span with OpenTelemetry
            const tracer = trace.getTracer('next-app-tracer');
            const span = tracer.startSpan('user.button.click');

            // Add some attributes to the span
            span.setAttribute('button.name', 'example-button');
            span.setAttribute('button.section', 'hero');

            // Simulate some work
            setTimeout(() => {
              span.end();
            }, 100);
          };

          return (
            <main>
              <h1>Next.js with OpenTelemetry Monitoring</h1>
              <div>
                <p>Click the button to trigger monitoring events</p>
                <button onClick={handleClick}>Track Event</button>
              </div>
            </main>
          );
        }
        `,
        'src/app/api/telemetry/route.ts': `
        // Mock API route to demonstrate server-side telemetry
        import { NextResponse } from 'next/server';
        import * as otel from '@vercel/otel';
        import { trace } from '@opentelemetry/api';

        export async function GET() {
          // Create a span for this API route
          const tracer = trace.getTracer('api-routes');
          const span = tracer.startSpan('api.telemetry.get');

          // Add attributes to the span
          span.setAttribute('http.method', 'GET');
          span.setAttribute('service.name', 'api-service');

          // Simulate API work
          await new Promise(resolve => setTimeout(resolve, 50));

          // End span before returning
          span.end();

          return NextResponse.json({ status: 'ok', message: 'Telemetry API response' });
        }
        `,
        'next.config.js': `
        /** @type {import('next').NextConfig} */
        const nextConfig = {
          // Enable instrumentation from Next.js
          experimental: {
            instrumentationHook: true
          }
        }

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
    expect(result.framework.secondaryMatches).toEqual({});
  });

  it('detects opentelemetry monitoring', async () => {
    expect(result.monitoring.name).toBe('opentelemetry');
    expect(result.monitoring.confidence).toBeGreaterThanOrEqual(1);
    expect(result.monitoring.secondaryMatches).toEqual({});
  });
});
