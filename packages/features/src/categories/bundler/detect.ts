import { Browser, Page } from 'playwright';
import { patterns } from './patterns/index.js';
import { Resources } from '@unbuilt/resources';
import { calculateResults } from '../../utils/calculate-results.js';

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
    type: 'bundler',
    name: result.name,
    confidence: result.confidence,
    secondaryMatches: getAllResultsWithConfidence(0.3, true),
  };
};
