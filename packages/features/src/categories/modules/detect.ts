import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import { patterns } from './patterns/index.js';
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
      resources,
      page,
      browser,
      patterns,
      analysis,
      type: 'dates',
    });

  const secondaryMatches = getAllResultsWithConfidence(0.3, true);

  return {
    type: 'modules',
    name: result.name,
    detectedFeatures: result.matched,
    confidence: result.confidence,
    secondaryMatches,
    _getAllResults: getAllResults,
  };
};
