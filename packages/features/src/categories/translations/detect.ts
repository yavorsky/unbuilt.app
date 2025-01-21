import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import { calculateResults } from '../../utils/calculate-results.js';
import { patterns } from './patterns/index.js';
import { AnalysisFeatures } from '../../types/analysis.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources,
  analysis?: AnalysisFeatures
) => {
  const translations = await calculateResults({
    resources,
    page,
    browser,
    patterns,
    type: 'translations',
    analysis,
  });

  return {
    type: 'translations',
    name: translations.result.name,
    detectedFeatures: translations.result.matched,
    confidence: translations.result.confidence,
    secondaryMatches: translations.getAllResultsWithConfidence(0.3, true),
    _getAllResults: translations.getAllResults,
  };
};
