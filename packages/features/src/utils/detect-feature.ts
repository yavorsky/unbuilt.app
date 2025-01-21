// User-facing function to detect a feature, which will return desired detection result.

import { Browser, Page } from 'playwright';
import { AnalysisFeatures, AnalysisKeys } from '../types/analysis.js';
import { calculateResults, Pattern } from './calculate-results.js';
import { Resources } from '@unbuilt/resources';

export async function detectFeature<
  T extends Record<string, Pattern<string>[]>,
>({
  resources,
  page,
  browser,
  patterns,
  analysis = null,
  type,
  minConfidence = 0.3,
  debug = false,
}: {
  resources: Resources;
  page: Page;
  type: AnalysisKeys;
  browser: Browser;
  patterns: T;
  analysis?: AnalysisFeatures | null;
  minConfidence?: number;
  debug?: boolean;
}) {
  const { result, getAllResultsWithConfidence, getAllResults } =
    await calculateResults({
      type,
      resources,
      page,
      browser,
      patterns,
      analysis,
      minConfidence,
      debug,
    });

  return {
    type,
    name: result.name,
    confidence: result.confidence,
    detectedFeatures: result.matched,
    secondaryMatches: getAllResultsWithConfidence(0.3, true),
    _getAllResults: getAllResults,
  };
}
