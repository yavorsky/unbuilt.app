import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import { preprocessorPatterns } from './patterns/preprocessor/index.js';
import { cssInJsPatterns } from './patterns/css-in-js/index.js';
import { calculateResults } from '../../utils/calculate-results.js';
import { AnalysisFeatures } from '../../types/analysis.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources,
  analysis?: AnalysisFeatures
) => {
  const {
    result: preprocessorResult,
    getAllResultsWithConfidence: getAllPreprocessorResultsWithConfidence,
    getAllResults: getAllPreprocessorResults,
  } = await calculateResults({
    resources,
    page,
    browser,
    patterns: preprocessorPatterns,
    analysis,
    type: 'stylingProcessor',
  });
  const {
    result: cssInJsResult,
    getAllResultsWithConfidence: getAllCssInJsResultsWithConfidence,
    getAllResults: getAllCssInJsResultsResults,
  } = await calculateResults({
    resources,
    page,
    browser,
    patterns: cssInJsPatterns,
    analysis,
    type: 'stylingProcessor',
  });

  const processorType =
    preprocessorResult.confidence > cssInJsResult.confidence
      ? 'preprocessor'
      : 'css-in-js';
  const processorResult =
    processorType === 'preprocessor' ? preprocessorResult : cssInJsResult;

  const secondaryMatches = {
    ...getAllPreprocessorResultsWithConfidence(
      0.3,
      processorType === 'preprocessor'
    ),
    ...getAllCssInJsResultsWithConfidence(0.3, processorType === 'css-in-js'),
  };

  return {
    type: 'styling-processor',
    name: processorResult.name,
    detectedFeatures: processorResult.matched,
    confidence: processorResult.confidence,
    secondaryMatches,
    _getAllResults: () => ({
      ...getAllPreprocessorResults(),
      ...getAllCssInJsResultsResults(),
    }),
  };
};
