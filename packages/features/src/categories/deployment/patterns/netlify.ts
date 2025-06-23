import { Page } from 'playwright';

export const netlify = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      // Netlify analytics and identity scripts
      /identity\.netlify\.com\/v1\/netlify-identity-widget\.js/,
      /identity-js\.netlify\.com/,
      /netlify-identity-widget\.js/,
      // Netlify form handling scripts
      /static\.netlify\.com\/unpkg/,
      /netlify-cms@\^2\.\d+\.\d+/,
    ],
    stylesheets: [
      // Netlify CMS styles
      /netlify-cms\.css/,
      /netlify-cms\/dist\/cms\.css/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.3,
    documents: [
      // Netlify-specific form attributes
      /<form[^>]*data-netlify[^>]*>/,
      /<form[^>]*netlify[^>]*>/,
      // Netlify identity widgets
      /<div[^>]*netlify-identity-button[^>]*>/,
      // Netlify CMS admin markers
      /<div[^>]*id="nc-root"[^>]*>/,
    ],
  },
  {
    name: 'headers' as const,
    score: 1.4,
    headers: {
      server: /^Netlify$/i,
      'x-nf-request-id': /.+/,
      'x-netlify': /.+/,
      'netlify-cdn': /.+/,
      'x-elastic-upstream': /netlify/i,
      'x-elastic-request-time': /.+/, // Often present on Netlify sites
    },
  },
  {
    name: 'url-check' as const,
    score: 0.8,
    browser: async (page: Page) => {
      const url = page.url();
      // Check for Netlify subdomains
      return url.includes('.netlify.app') || url.includes('.netlify.com');
    },
  },
  {
    name: 'netlify-redirects' as const,
    score: 0.5,
    browser: async (page: Page) => {
      try {
        // Check for netlify _redirects file existence
        const response = await page.request.fetch('/_redirects', {
          method: 'HEAD',
        });
        return response.status() === 200;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'netlify-toml-check' as const,
    score: 0.5,
    browser: async (page: Page) => {
      try {
        // Check for netlify.toml file existence (sometimes exposed)
        const response = await page.request.fetch('/netlify.toml', {
          method: 'HEAD',
        });
        return response.status() === 200;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'netlify-functions' as const,
    score: 0.7,
    browser: async (page: Page) => {
      try {
        // Check for common Netlify functions path patterns
        const functionsPaths = ['/.netlify/functions', '/.functions'];

        for (const path of functionsPaths) {
          try {
            await page.waitForResponse(
              (response) => response.url().includes(path),
              { timeout: 1000 }
            );
            return true;
          } catch {
            // Continue to next check
          }
        }
        return false;
      } catch {
        return false;
      }
    },
  },
];
