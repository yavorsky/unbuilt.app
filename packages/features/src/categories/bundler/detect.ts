import { Browser, Page } from 'playwright';
import { patterns } from './patterns/index.js';
import { Resources } from '@unbuilt/resources';
import { calculateResults } from '../../utils/calculate-results.js';
import { AnalysisFeatures } from '../../types/analysis.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources,
  analysis?: AnalysisFeatures
) => {
  const { result, getAllResultsWithConfidence, getAllResults } =
    await calculateResults({
      type: 'bundler',
      resources,
      page,
      browser,
      patterns,
      analysis,
    });

  return {
    type: 'bundler',
    name: result.name,
    confidence: result.confidence,
    detectedFeatures: result.matched,
    secondaryMatches: getAllResultsWithConfidence(0.3, true),
    _getAllResults: getAllResults,
  };
};
