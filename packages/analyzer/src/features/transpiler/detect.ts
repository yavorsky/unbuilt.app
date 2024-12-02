import { Browser, Page } from 'playwright';
import { Resources } from '../../resources.js';
import { patterns } from './patterns/index.js';
import { calculateResults } from '../../calculate-results.js';

const detectableFrameworkFeatures = ['react-compiler'] as const;

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources
) => {
  const { result, getAllResultsWithConfidence } = await calculateResults(
    resources,
    page,
    browser,
    patterns
  );

  const features = new Set<(typeof detectableFrameworkFeatures)[number]>();

  detectableFrameworkFeatures
    .filter(
      (feature): feature is (typeof detectableFrameworkFeatures)[number] =>
        result.matched.has(feature)
    )
    .forEach((feature) => features.add(feature));

  return {
    type: 'transpiler',
    name: result.name,
    confidence: result.confidence,
    detectedFeatures: features,
    secondaryMatches: getAllResultsWithConfidence(0.3),
  };
};
