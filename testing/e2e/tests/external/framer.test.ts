import { describe, expect, it } from 'vitest';
import { analyzeExternalApp } from '../../testkits/external/analyze-external-app.js';

describe('detects Framer as platform', async () => {
  const result = await analyzeExternalApp({
    url: 'https://amazing-tool-275239.framer.app/',
  });

  it('detects Framer usage', async () => {
    expect(result.platform.name).toBe('framer');
    expect(result.platform.confidence).toBeGreaterThanOrEqual(1);
  });
});
