import { describe, expect, it } from 'vitest';
import { analyzeExternalApp } from '../../testkits/external/analyze-external-app.js';

describe('detects Bisup as hosting', async () => {
  const result = await analyzeExternalApp({
    url: 'https://www.bisup.com/',
  });

  it('detects Bisup hosting', async () => {
    expect(result.hosting.name).toBe('bisup');
    expect(result.hosting.confidence).toBeGreaterThanOrEqual(1);
  });
});
