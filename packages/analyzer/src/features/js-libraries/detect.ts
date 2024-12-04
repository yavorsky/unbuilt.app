import { Browser, Page } from 'playwright';
import { Resources } from '../../resources.js';
import { calculateResults } from '../../calculate-results.js';
import {
  stateManagementPatterns,
  httpClientPatterns,
  datePatterns,
  translationsPatterns,
  routerPatterns,
} from './patterns/index.js';

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

  const httpClient = await calculateResults(
    resources,
    page,
    browser,
    httpClientPatterns
  );

  const date = await calculateResults(resources, page, browser, datePatterns);

  const translations = await calculateResults(
    resources,
    page,
    browser,
    translationsPatterns
  );

  const router = await calculateResults(
    resources,
    page,
    browser,
    routerPatterns
  );

  return {
    stateManagement: {
      name: stateManagement.result.name,
      confidence: stateManagement.result.confidence,
      results: stateManagement.getAllResultsWithConfidence(0.3, true),
    },
    httpClient: {
      name: httpClient.result.name,
      confidence: httpClient.result.confidence,
      results: httpClient.getAllResultsWithConfidence(0.3, true),
    },
    date: {
      name: date.result.name,
      confidence: date.result.confidence,
      results: date.getAllResultsWithConfidence(0.3, true),
    },
    translations: {
      name: translations.result.name,
      confidence: translations.result.confidence,
      results: translations.getAllResultsWithConfidence(0.3, true),
    },
    router: {
      name: router.result.name,
      confidence: router.result.confidence,
      results: router.getAllResultsWithConfidence(0.3, true),
    },
  };
};
