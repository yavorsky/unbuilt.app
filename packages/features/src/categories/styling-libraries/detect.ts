import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import { patterns } from './patterns/index.js';
import { calculateResults } from '../../utils/calculate-results.js';

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
