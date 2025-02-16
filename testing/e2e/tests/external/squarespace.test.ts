import { describe, expect, it } from 'vitest';
import { analyzeExternalApp } from '../../testkits/external/analyze-external-app.js';

describe('detects Squarespace as platform', async () => {
  const result = await analyzeExternalApp({
    url: 'https://www.elahousestudio.com',
  });

  it('detects Squarespace usage', async () => {
    expect(result.platform.name).toBe('squarespace');
    expect(result.platform.confidence).toBeGreaterThanOrEqual(1);
  });
});
