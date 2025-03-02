import { describe, expect, it } from 'vitest';
import { analyzeExternalApp } from '../../testkits/external/analyze-external-app.js';

describe('detects Webflow as platform', async () => {
  const result = await analyzeExternalApp({
    url: 'https://artems-stellar-site-100563.webflow.io/',
  });

  it('detects Webflow usage', async () => {
    expect(result.platform.name).toBe('webflow');
    expect(result.platform.confidence).toBeGreaterThanOrEqual(1);
  });
});
