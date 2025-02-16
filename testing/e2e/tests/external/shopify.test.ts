import { describe, expect, it } from 'vitest';
import { analyzeExternalApp } from '../../testkits/external/analyze-external-app.js';

describe('detects Shopify as platform', async () => {
  const result = await analyzeExternalApp({
    url: 'https://dbjourney.com',
  });

  it('detects Shopify usage', async () => {
    expect(result.platform.name).toBe('shopify');
    expect(result.platform.confidence).toBeGreaterThanOrEqual(1);
  });
});
