import { Browser, Page } from 'playwright';
import { patterns } from './patterns/index.js';
import { calculateResults } from '../../utils/calculate-results.js';
import { Resources } from '@unbuilt/resources';
import { AnalysisFeatures } from '../../types/analysis.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources,
  analysis?: AnalysisFeatures
) => {
  const { result, getAllResultsWithConfidence, getAllResults } =
    await calculateResults({
      resources,
      page,
      browser,
      patterns,
      analysis,
      type: 'minifier',
    });

  return {
    type: 'minifier',
    name: result.name,
    detectedFeatures: result.matched,
    confidence: result.confidence,
    secondaryMatches: getAllResultsWithConfidence(0.5, true),
    _getAllResults: getAllResults,
  };
};
