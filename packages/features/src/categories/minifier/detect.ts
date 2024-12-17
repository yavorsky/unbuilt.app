import { Browser, Page } from 'playwright';
import { patterns } from './patterns/index.js';
import { calculateResults } from '../../utils/calculate-results.js';
import { Resources } from '@unbuilt/resources';

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
    secondaryMatches: getAllResultsWithConfidence(0.3, true),
  };
};
