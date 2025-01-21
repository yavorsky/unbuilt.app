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
  const { getAllResultsWithConfidence, getAllResults, result } =
    await calculateResults({
      resources,
      page,
      browser,
      patterns,
      type: 'stylingLibraries',
      analysis,
    });
  const items = getAllResultsWithConfidence(0.3);

  return {
    items,
    detectedFeatures: result.matched,
    _getAllResults: getAllResults,
  };
};
