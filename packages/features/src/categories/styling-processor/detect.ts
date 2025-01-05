import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import { preprocessorPatterns } from './patterns/preprocessor/index.js';
import { cssInJsPatterns } from './patterns/css-in-js/index.js';
import { calculateResults } from '../../utils/calculate-results.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources
) => {
  const {
    result: preprocessorResult,
    getAllResultsWithConfidence: getAllPreprocessorResultsWithConfidence,
  } = await calculateResults(resources, page, browser, preprocessorPatterns);
  const {
    result: cssInJsResult,
    getAllResultsWithConfidence: getAllCssInJsResultsWithConfidence,
  } = await calculateResults(resources, page, browser, cssInJsPatterns);

  const processorType =
    preprocessorResult.confidence > cssInJsResult.confidence
      ? 'preprocessor'
      : 'css-in-js';
  const processorResult =
    processorType === 'preprocessor' ? preprocessorResult : cssInJsResult;

  const secondaryMatches = {
    ...getAllPreprocessorResultsWithConfidence(0.3, true),
    ...getAllCssInJsResultsWithConfidence(0.3, true),
  };

  return {
    type: 'styling-processor',
    name: processorResult.name,
    confidence: processorResult.confidence,
    secondaryMatches,
  };
};
