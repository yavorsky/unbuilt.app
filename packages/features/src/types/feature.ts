import { AllPatternNames, Pattern } from './pattern.js';

export interface FeatureResult<Names extends string> {
  confidence: number;
  matched: Set<Names>;
}

export interface CalculationResult<
  T extends Record<string, Pattern<string>[]>,
> {
  result: {
    name: keyof T | 'unknown';
    confidence: number;
    matched: Set<AllPatternNames<T>>;
  };
  getResultFor(featureName: keyof T): FeatureResult<AllPatternNames<T>> | null;
  getAllResultsWithConfidence(
    minConfidence: number,
    ignoreMainResult?: boolean
  ): Record<keyof T, FeatureResult<AllPatternNames<T>>>;
  getAllResults(): Record<keyof T, FeatureResult<AllPatternNames<T>>>;
}
