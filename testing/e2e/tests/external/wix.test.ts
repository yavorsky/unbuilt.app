import { describe, expect, it } from 'vitest';
import { analyzeExternalApp } from '../../testkits/external-app.js';

describe('detects Wix as platform', async () => {
  const result = await analyzeExternalApp({
    url: 'https://aqsonmail.wixsite.com/kaori',
  });

  it('detects Wix usage', async () => {
    expect(result.platform.name).toBe('wix');
    expect(result.platform.confidence).toBeGreaterThanOrEqual(1);
  });
});
