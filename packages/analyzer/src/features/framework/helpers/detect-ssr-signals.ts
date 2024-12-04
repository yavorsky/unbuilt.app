import { Browser, Page } from 'playwright';
import { calculateSimilarity } from '../../../utils.js';

export const detectSSRSignals = async (page: Page, browser: Browser) => {
  const signals = await collectSSRSignals(page, browser);
  return evaluateSSRSignals(signals);
};

const collectSSRSignals = async (page: Page, browser: Browser) => {
  // First request - check initial HTML
  const initialResponse = await page!.goto(page!.url(), {
    waitUntil: 'domcontentloaded',
  });
  const initialHtml = (await initialResponse?.text()) || '';

  // Second request - with JS disabled
  const context = await browser!.newContext({
    javaScriptEnabled: false,
  });
  const noJsPage = await context.newPage();
  const noJsResponse = await noJsPage.goto(page!.url());
  const noJsHtml = (await noJsResponse?.text()) || '';

  // Clean up
  await context.close();

  // Compare and collect signals
  return {
    // Check if meaningful content is present without JS
    hasContentWithoutJs: noJsHtml.length > 1000 && noJsHtml.includes('</div>'),

    // Check for common SSR markers
    hasCommonSSRMarkers:
      initialHtml.includes('data-server-rendered') ||
      initialHtml.includes('data-reactroot') ||
      initialHtml.includes('data-nextjs-page') ||
      initialHtml.includes('data-n-head="ssr"'),

    // Check for hydration markers
    hasHydrationMarkers:
      initialHtml.includes('<!--$-->') ||
      initialHtml.includes('<!--[-->') ||
      initialHtml.includes('<!---->'),

    // Check for static content markers
    hasStaticMarkers:
      initialHtml.includes('static-page') || initialHtml.includes('prerender'),

    // Compare content with and without JS
    hasSimilarContent: calculateSimilarity(initialHtml, noJsHtml) > 0.7,

    // Check for meta tags that are typically server-rendered
    hasServerRenderedMeta:
      initialHtml.includes('og:') && initialHtml.includes('twitter:'),

    // Check for structured data
    hasStructuredData: initialHtml.includes('application/ld+json'),
  };
};

const evaluateSSRSignals = (signals: Record<string, boolean>): boolean => {
  // Assign weights to different signals
  const weights = {
    hasContentWithoutJs: 0.3,
    hasCommonSSRMarkers: 0.2,
    hasHydrationMarkers: 0.15,
    hasStaticMarkers: 0.1,
    hasSimilarContent: 0.15,
    hasServerRenderedMeta: 0.05,
    hasStructuredData: 0.05,
  };

  // Calculate weighted score
  const score = Object.entries(signals).reduce((total, [signal, present]) => {
    return total + (present ? weights[signal as keyof typeof weights] : 0);
  }, 0);

  // Return true if score exceeds threshold
  return score > 0.5;
};
