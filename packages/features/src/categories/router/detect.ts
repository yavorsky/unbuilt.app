import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import { patterns } from './patterns/index.js';
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
    patterns,
    0.5,
    true
  );

  return {
    type: 'router',
    name: result.name,
    confidence: result.confidence,
    secondaryMatches: getAllResultsWithConfidence(0.3, true),
  };
};
