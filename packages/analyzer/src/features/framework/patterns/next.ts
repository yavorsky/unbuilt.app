import { Browser, Page } from 'playwright';
import { detectSSRSignals } from '../helpers/detect-ssr-signals.js';

export const next = [
  // Runtime patterns
  {
    score: 0.3,
    name: 'runtimeVariables' as const,
    runtime: [
      // Core Next.js patterns
      /__NEXT_DATA__/,
      /__NEXT_LOADED_PAGES__/,
      /next\/router|next\/link/,
      /__next_app|__next_init/,
      // Next.js 13+ patterns
      /next\/navigation/,
      /createNextRouteHandler/,
      // App directory patterns
      /page\.tsx?$/,
      /layout\.tsx?$/,
      /loading\.tsx?$/,
      /error\.tsx?$/,
    ],
  },
  // Runtime component patterns
  {
    score: 0.2,
    name: 'componentsDirectives' as const,
    runtime: [
      // Built-in components
      /next\/image/,
      /next\/script/,
      /next\/head/,
      /next\/dynamic/,
      /next\/font/,
      // App router components
      /'use client'/,
      /'use server'/,
      // Metadata
      /generateMetadata/,
    ],
  },
  {
    score: 0.2,
    name: 'markupMarkers' as const,
    runtime: [
      /data-nextjs/,
      /next-route-announcer/,
      /next-page/,
      /__next-css/,
      // Next.js specific class names
      /__next/,
      /next-error/,
      /nprogress/,
    ],
  },
  {
    score: 0.2,
    name: 'inlineScripts' as const,
    runtime: [
      // Data fetching
      /getStaticProps/,
      /getServerSideProps/,
      /getInitialProps/,
      // Routing
      /useRouter|withRouter/,
      /usePathname|useSearchParams/,
      // Middleware
      /_middleware/,
      // Next.js 13+ features
      /useSelectedLayoutSegment/,
      /generateStaticParams/,
    ],
  },
  {
    score: 0.1,
    name: 'buildOutput' as const,
    runtime: [
      // Build output
      /\.next\//,
      /next\.config\./,
      /next-env\.d\.ts/,
      // Build features
      /optimizeFonts/,
      /transpilePackages/,
      /serverComponentsExternalPackages/,
    ],
  },
  {
    score: 0.1,
    name: 'routing' as const,
    runtime: [
      // File-based routing
      /\[\.{3}\w+\]/, // catch-all routes
      /\[\w+\]/, // dynamic routes
      // App router
      /route\.tsx?$/,
      /loading\.tsx?$/,
      /not-found\.tsx?$/,
    ],
  },
  {
    score: 0.1,
    name: 'serverScripts' as const,
    runtime: [
      // Server actions
      /'use server'/,
      /formAction/,
      // Data fetching
      /revalidatePath/,
      /revalidateTag/,
      /unstable_noStore/,
    ],
  },
  {
    score: 0.1,
    name: 'staticScripts' as const,
    runtime: [
      // SSR specific
      /generateStaticParams/,
      /generateMetadata/,
      /cookies\(\)/,
      /headers\(\)/,
      /notFound\(\)/,
      /redirect\(\)/,
    ],
  },
  // Framework features detection
  // With this approach we can use pattern group to increase the framework score and detect specific features.
  // Has SSR
  {
    score: 0.3,
    name: 'ssr' as const,
    runtime: [/getServerSideProps/, /getInitialProps/],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Next.js data object
          hasNextData: !!window.__NEXT_DATA__,

          // Next.js specific props
          hasPageProps: document.querySelector('[data-nextjs-page]') !== null,

          // Static optimization indicator
          hasStaticOptimization: !!window.__NEXT_DATA__?.autoExport,

          // Server-side generated styles
          hasSSRStyles: !!document.querySelector('style[data-n-href]'),

          // Check for specific Next.js attributes
          hasNextAttributes: document
            .querySelector('[data-reactroot]')
            ?.hasAttribute('data-nextjs-page'),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  // Generic SSR detection
  {
    score: 0.1,
    name: 'ssr' as const,
    browser: async (page: Page, browser: Browser) => {
      return detectSSRSignals(page, browser);
    },
  },
  {
    score: 0.2,
    name: 'ssg' as const,
    runtime: [/getStaticProps/, /getStaticPaths/],
  },
  {
    score: 0.2,
    name: 'isr' as const,
    runtime: [/revalidate:\s*\d+/],
  },
];
