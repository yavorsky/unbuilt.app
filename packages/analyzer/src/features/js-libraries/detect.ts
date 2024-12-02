import { Browser, Page } from 'playwright';
import { Resources } from '../../resources.js';
import { calculateResults } from '../../calculate-results.js';
import { stateManagementPatterns } from './patterns/index.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources
) => {
  const stateManagement = await calculateResults(
    resources,
    page,
    browser,
    stateManagementPatterns
  );

  return {
    stateManagement: {
      name: stateManagement.result.name,
      confidence: stateManagement.result.confidence,
      results: stateManagement.getAllResultsWithConfidence(0.3),
    },
  };
};
