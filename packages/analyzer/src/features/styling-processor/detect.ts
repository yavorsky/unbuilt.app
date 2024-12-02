import { Browser, Page } from 'playwright';
import { Resources } from '../../resources.js';
import { preprocessorPatterns } from './patterns/preprocessor/index.js';
import { cssInJsPatterns } from './patterns/css-in-js/index.js';
import { calculateResults } from '../../calculate-results.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources
) => {
  const { result: preprocessorResult } = await calculateResults(
    resources,
    page,
    browser,
    preprocessorPatterns
  );
  const { result: cssInJsResult } = await calculateResults(
    resources,
    page,
    browser,
    cssInJsPatterns
  );

  const processorType =
    preprocessorResult.confidence > cssInJsResult.confidence
      ? 'preprocessor'
      : 'css-in-js';
  const processorResult =
    processorType === 'preprocessor' ? preprocessorResult : cssInJsResult;

  return {
    type: 'styling',
    processor: {
      name: processorResult.name,
      type: processorType,
      confidence: processorResult.confidence,
    },
  };
};
