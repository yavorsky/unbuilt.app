// User-facing function to detect a feature, which will return desired detection result.

import { Browser, Page } from 'playwright';
import { AnalysisFeatures, AnalysisKeys } from '../types/analysis.js';
import { calculateResults } from './calculate-results.js';
import { Resources } from '@unbuilt/resources';
import { AllPatternNames, Pattern } from '../types/pattern.js';
import { FeatureResult } from '../types/feature.js';

// Input parameters type
export type DetectFeatureParams<
  K extends AnalysisKeys,
  T extends Record<string, Pattern<string>[]>,
> = {
  resources: Resources;
  page: Page;
  type: K;
  browser: Browser;
  patterns: T;
  analysis?: AnalysisFeatures | null;
  minConfidence?: number;
  debug?: boolean;
};

// Return type
export type DetectFeatureResult<
  K extends AnalysisKeys,
  T extends Record<string, Pattern<string>[]>,
> = {
  type: K;
  name: keyof T | 'unknown';
  confidence: number;
  detectedFeatures: Set<AllPatternNames<T>>;
  secondaryMatches: Record<keyof T, FeatureResult<AllPatternNames<T>>>;
  _getAllResults?: () => Record<keyof T, FeatureResult<AllPatternNames<T>>>;
};

// Updated function signature using the new types
export async function detectFeature<
  K extends AnalysisKeys,
  T extends Record<string, Pattern<string>[]>,
>(params: DetectFeatureParams<K, T>): Promise<DetectFeatureResult<K, T>> {
  const { result, getAllResultsWithConfidence, getAllResults } =
    await calculateResults<T>({
      type: params.type,
      resources: params.resources,
      page: params.page,
      browser: params.browser,
      patterns: params.patterns,
      analysis: params.analysis,
      minConfidence: params.minConfidence,
      debug: params.debug,
    });

  return {
    type: params.type,
    name: result.name,
    confidence: result.confidence,
    detectedFeatures: result.matched,
    secondaryMatches: getAllResultsWithConfidence(
      params.minConfidence ?? 0.3,
      true
    ),
    _getAllResults: getAllResults,
  };
}
