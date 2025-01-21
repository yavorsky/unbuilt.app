import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import { patterns } from './patterns/index.js';
import { calculateResults } from '../../utils/calculate-results.js';
import { AnalysisFeatures } from '../../types/analysis.js';

const detectableFrameworkFeatures = ['ssr'] as const;

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources,
  analysis?: AnalysisFeatures
) => {
  const { result, getAllResultsWithConfidence, getAllResults } =
    await calculateResults({
      analysis,
      resources,
      page,
      browser,
      patterns,
      type: 'framework',
    });

  const frameworkFeatures = new Set<
    (typeof detectableFrameworkFeatures)[number]
  >();

  detectableFrameworkFeatures
    .filter(
      (feature): feature is (typeof detectableFrameworkFeatures)[number] =>
        result.matched.has(feature)
    )
    .forEach((feature) => frameworkFeatures.add(feature));

  return {
    type: 'framework',
    name: result.name,
    confidence: result.confidence,
    detectedFeatures: frameworkFeatures,
    secondaryMatches: getAllResultsWithConfidence(0.3, true),
    _getAllResults: getAllResults,
  };
};
