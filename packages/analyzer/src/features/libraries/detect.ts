import { Browser, Page } from 'playwright';
import { Resources } from '../../resources.js';
import { patterns } from './patterns/date/index.js';
import { calculateResults } from '../../calculate-results.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources
) => {
  const { result, getAllResultsWithConfidence } = await calculateResults(
    resources,
    page,
    browser,
    patterns
  );

  return {
    name: result.name,
    confidence: result.confidence,
    results: getAllResultsWithConfidence(0.3),
  };
};
