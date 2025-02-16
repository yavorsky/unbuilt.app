import { AnalyzeResult } from '@unbuilt/analyzer';
import { afterAll } from 'vitest';
import { normalizeUrl } from '@unbuilt/helpers';
import { analyzeApp } from '../helpers/analyze.js';
import { closeBrowser } from '../helpers/browser-context.js';

export async function analyzeExternalApp({
  url,
}: {
  url: string;
}): Promise<AnalyzeResult['analysis']> {
  const normalizedUrl = normalizeUrl(url);
  const result = await analyzeApp(normalizedUrl);
  return result;
}

// Cleanup browser on test suite completion
afterAll(async () => {
  await closeBrowser();
});
