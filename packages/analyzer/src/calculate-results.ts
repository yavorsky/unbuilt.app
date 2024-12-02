import { Browser, Page } from 'playwright';
import { Resources } from './resources.js';

export interface Pattern<Name extends string = string> {
  score: number;
  name: Name;
  runtime?: RegExp[];
  filenames?: RegExp[];
  browser?: (page: Page, browser: Browser) => boolean | Promise<boolean>;
}

type InferPatternNames<T> = T extends Pattern<infer Name>[] ? Name : never;

type AllPatternNames<T> = {
  [K in keyof T]: InferPatternNames<T[K]>;
}[keyof T];

export interface FeatureResult<Names extends string> {
  confidence: number;
  matched: Set<Names>;
}

export interface CalculationResult<
  T extends Record<string, Pattern<string>[]>,
> {
  result: {
    name: keyof T;
    confidence: number;
    matched: Set<AllPatternNames<T>>;
  };
  getResultFor(featureName: keyof T): FeatureResult<AllPatternNames<T>> | null;
  getAllResultsWithConfidence(
    minConfidence: number
  ): Record<keyof T, FeatureResult<AllPatternNames<T>>>;
  getAllResults(): Record<keyof T, FeatureResult<AllPatternNames<T>>>;
}

async function processPatterns<Names extends string>(
  patterns: Pattern<Names>[],
  resources: Resources,
  page: Page,
  browser: Browser
): Promise<{ totalScore: number; matchedPatterns: Set<Names> }> {
  const content = resources.getAllScriptsContent();
  const filenames = Array.from(resources.getAllScriptsNames());

  const results = await Promise.all(
    patterns.map(async (pattern) => {
      let patternScore = 0;
      const matchedPatterns = new Set<Names>();

      if (pattern.runtime) {
        pattern.runtime.forEach((runtimePattern) => {
          if (runtimePattern.test(content)) {
            patternScore += pattern.score;
            matchedPatterns.add(pattern.name);
          }
        });
      }

      if (pattern.filenames) {
        pattern.filenames.forEach((runtimePattern) => {
          const matched = filenames.some((filename) =>
            runtimePattern.test(filename)
          );
          if (matched) {
            patternScore += pattern.score;
            matchedPatterns.add(pattern.name);
          }
        });
      }

      if (pattern.browser) {
        const isMatched = await pattern.browser(page, browser);
        if (isMatched) {
          patternScore += pattern.score;
          matchedPatterns.add(pattern.name);
        }
      }

      return { patternScore, matchedPatterns };
    })
  );

  return results.reduce(
    (acc, { patternScore, matchedPatterns }) => ({
      totalScore: acc.totalScore + patternScore,
      matchedPatterns: new Set([...acc.matchedPatterns, ...matchedPatterns]),
    }),
    { totalScore: 0, matchedPatterns: new Set<Names>() }
  );
}

export async function calculateResults<
  T extends Record<string, Pattern<string>[]>,
>(
  resources: Resources,
  page: Page,
  browser: Browser,
  patterns: T
): Promise<CalculationResult<T>> {
  const results = await Promise.all(
    Object.entries(patterns).map(async ([name, patternList]) => {
      const processed = await processPatterns(
        patternList,
        resources,
        page,
        browser
      );
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

  const highestResult = results.reduce((prev, current) =>
    prev.confidence > current.confidence ? prev : current
  );

  return {
    result: {
      name: highestResult.name as keyof T,
      confidence: highestResult.confidence,
      matched: highestResult.matched,
    },
    getAllResultsWithConfidence: (minConfidence = 0.3) => {
      return Object.entries(calculatedResults).reduce(
        (acc, [key, value]) => {
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
