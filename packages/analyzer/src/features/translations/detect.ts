import { Browser, Page } from 'playwright';
import { Resources } from '../../resources.js';
import { calculateResults } from '../../calculate-results.js';
import { patterns } from './patterns/index.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources
) => {
  const translations = await calculateResults(
    resources,
    page,
    browser,
    patterns
  );

  return {
    name: translations.result.name,
    confidence: translations.result.confidence,
    secondaryMatches: translations.getAllResultsWithConfidence(0.3, true),
  };
};
