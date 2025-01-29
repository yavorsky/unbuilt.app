import { Resources } from '@unbuilt/resources';
import { Browser, Page } from 'playwright';
import { AnalysisFeatures, AnalysisKeys } from '../types/analysis.js';
import { AllPatternNames, Pattern } from '../types/pattern.js';
import { CalculationResult, FeatureResult } from '../types/feature.js';
import { processDependencies } from './process-dependencies.js';
import { processPatterns } from './process-patterns.js';

export async function calculateResults<
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
}): Promise<CalculationResult<T>> {
  // If the process already completed and we are taking recalculation
  const prevResult = analysis?.[type]?._getAllResults?.() as Record<
    string,
    FeatureResult<AllPatternNames<T>>
  >;

  const results = await Promise.all(
    Object.entries(patterns).map(async ([name, patternList]) => {
      if (debug) {
        console.log('Processing patterns for', name);
      }
      const featureScore = prevResult?.[name as keyof typeof prevResult];
      let processed: {
        totalScore: number;
        matchedPatterns: Set<string>;
      };

      // Post calculation
      if (analysis && featureScore) {
        processed = processDependencies(
          patternList,
          {
            totalScore: featureScore?.confidence,
            matchedPatterns: featureScore?.matched,
          },
          analysis
        );
      } else {
        // Initial calculation
        processed = await processPatterns(
          patternList,
          resources,
          page,
          browser,
          debug,
          name
        );
      }
      return {
        name,
        confidence: processed.totalScore,
        matched: processed.matchedPatterns as Set<AllPatternNames<T>>,
      };
    })
  );

  const initialResults = Object.keys(patterns).reduce(
    (acc, key) => {
      acc[key as keyof T] = {
        confidence: 0,
        matched: new Set(),
      } as FeatureResult<AllPatternNames<T>>;
      return acc;
    },
    {} as Record<keyof T, FeatureResult<AllPatternNames<T>>>
  );

  const calculatedResults = results.reduce((acc, curr) => {
    acc[curr.name as keyof T] = {
      confidence: curr.confidence,
      matched: curr.matched,
    };
    return acc;
  }, initialResults);

  let highestResult = results.reduce((prev, current) =>
    prev.confidence > current.confidence ? prev : current
  );

  if (highestResult.confidence < minConfidence) {
    highestResult = {
      name: 'unknown',
      confidence: 0,
      matched: new Set(),
    };
  }

  return {
    result: {
      name: highestResult.name as keyof T,
      confidence: highestResult.confidence,
      matched: highestResult.matched,
    },
    getAllResultsWithConfidence: (
      minConfidence = 0.3,
      ignoreMainResult = false
    ) => {
      return Object.entries(calculatedResults).reduce(
        (acc, [key, value]) => {
          if (ignoreMainResult && key === highestResult.name) {
            return acc;
          }
          if (value.confidence >= minConfidence) {
            acc[key as keyof T] = value;
          }
          return acc;
        },
        {} as Record<keyof T, FeatureResult<AllPatternNames<T>>>
      );
    },
    getAllResults: () => calculatedResults,
    getResultFor: (featureName: keyof T) =>
      calculatedResults[featureName] || null,
  };
}
