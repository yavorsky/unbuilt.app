import { Page } from 'playwright';

export const vercel = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      // Vercel analytics and monitoring scripts
      /vitals\.vercel-insights\.com/,
      /vitals\.vercel-analytics\.com/,
      /speed-insights-sdk\.vercel\.app/,
      // Vercel-specific script patterns
      /\/_vercel\/insights\/script\.js/,
      /\/_vercel\/speed-insights\//,
    ],
    stylesheets: [
      // Vercel specific CSS files
      /vercel\.app\/_next\/static\/css/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.3,
    documents: [
      // Vercel-specific meta tags
      /<meta\s+name="vercel-deployment-url"/,
      /<meta\s+name="vercel-git-commit-sha"/,
      /<meta\s+name="vercel-edge-network-region"/,
    ],
  },
  {
    name: 'headers' as const,
    score: 1.4,
    headers: {
      server: /^Vercel$/i,
      'x-vercel-id': /.+/,
      'x-vercel-cache': /.+/,
      'x-vercel-age': /.+/,
    },
  },
  {
    name: 'url-check' as const,
    score: 0.8,
    browser: async (page: Page) => {
      const url = page.url();
      return url.includes('.vercel.app');
    },
  },
];
