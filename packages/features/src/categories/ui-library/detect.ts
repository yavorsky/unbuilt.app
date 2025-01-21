import { Browser, Page } from 'playwright';
import { patterns } from './patterns/index.js';
import { calculateResults } from '../../utils/calculate-results.js';
import { Resources } from '../../../../resources/build/resources.js';
import { AnalysisFeatures } from '../../types/analysis.js';

// We want to additionally track ssr to some ui-library cases.
const detectableFrameworkFeatures = ['ssr'] as const;

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
    type: 'ui-library',
    name: result.name,
    confidence: result.confidence,
    detectedFeatures: frameworkFeatures,
    secondaryMatches: getAllResultsWithConfidence(0.3, true),
    _getAllResults: getAllResults,
  };
};
