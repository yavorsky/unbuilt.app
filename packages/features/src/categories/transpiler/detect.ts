import { Browser, Page } from 'playwright';
import { patterns } from './patterns/index.js';
import { calculateResults } from '../../utils/calculate-results.js';
import { Resources } from '@unbuilt/resources';

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
    patterns,
    0.3,
    true
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
    secondaryMatches: getAllResultsWithConfidence(0.3, true),
  };
};
