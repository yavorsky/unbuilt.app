// Input parameters type - reusing the same structure but with different generics
import { Browser, Page } from 'playwright';
import { AnalysisFeatures, AnalysisKeys } from '../types/analysis.js';
import {
  AllPatternNames,
  calculateResults,
  FeatureResult,
  Pattern,
} from './calculate-results.js';
import { Resources } from '@unbuilt/resources';

export type DetectMultipleFeaturesParams<
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

// Return type for multiple features
export type DetectMultipleFeaturesResult<
  T extends Record<string, Pattern<string>[]>,
> = {
  items: Record<keyof T, FeatureResult<AllPatternNames<T>>>;
  detectedFeatures: Set<AllPatternNames<T>>;
  _getAllResults?: () => Record<keyof T, FeatureResult<AllPatternNames<T>>>;
};

// Updated function signature using the new types
export async function detectMultipleFeatures<
  K extends AnalysisKeys,
  T extends Record<string, Pattern<string>[]>,
>(
  params: DetectMultipleFeaturesParams<K, T>
): Promise<DetectMultipleFeaturesResult<T>> {
  const { getAllResultsWithConfidence, getAllResults, result } =
    await calculateResults<T>({
      resources: params.resources,
      page: params.page,
      browser: params.browser,
      patterns: params.patterns,
      type: params.type,
      analysis: params.analysis,
      minConfidence: params.minConfidence,
      debug: params.debug,
    });
  const items = getAllResultsWithConfidence(params.minConfidence ?? 0.3);

  return {
    items,
    detectedFeatures: result.matched,
    _getAllResults: getAllResults,
  };
}
