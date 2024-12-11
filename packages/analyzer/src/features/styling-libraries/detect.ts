import { Browser, Page } from 'playwright';
import { Resources } from '../../resources.js';
import { patterns } from './patterns/index.js';
import { calculateResults } from '../../calculate-results.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources
) => {
  const { getAllResultsWithConfidence } = await calculateResults(
    resources,
    page,
    browser,
    patterns
  );
  const items = getAllResultsWithConfidence(0.3);

  return {
    items,
  };
};
