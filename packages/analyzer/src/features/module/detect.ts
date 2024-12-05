import { Browser, Page } from 'playwright';
import { Resources } from '../../resources.js';
import { patterns } from './patterns/index.js';
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

  const secondaryMatches = getAllResultsWithConfidence(0.3, true);

  return {
    name: result.name,
    confidence: result.confidence,
    secondaryMatches,
    mixedResults: Object.keys(secondaryMatches).length > 1,
  };
};
