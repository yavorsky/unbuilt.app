import { Resources } from '@unbuilt/resources';
import { Browser, Page } from 'playwright';

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

async function processPatterns<Names extends string>(
  patterns: Pattern<Names>[],
  resources: Resources,
  page: Page,
  browser: Browser,
  debug: boolean = false
): Promise<{ totalScore: number; matchedPatterns: Set<Names> }> {
  const content = resources.getAllScriptsContent();
  const filenames = Array.from(resources.getAllScriptsNames());

  const result = {
    totalScore: 0,
    matchedPatterns: new Set<Names>(),
  };

  for (const pattern of patterns) {
    if (pattern.runtime) {
      for (const runtimePattern of pattern.runtime) {
        let matched = false;
        try {
          matched = runtimePattern.test(content);
        } catch (e) {
          console.error(
            `Error while running filename pattern for ${pattern.name}`,
            e
          );
        }

        if (matched) {
          result.totalScore += pattern.score;
          result.matchedPatterns.add(pattern.name);
          if (debug) {
            console.log(
              'Matched: ',
              pattern.name,
              pattern.score,
              runtimePattern,
              ' runtime'
            );
          }
        }
      }
    }

    if (pattern.filenames) {
      for (const filenamePattern of pattern.filenames) {
        let matched = false;
        try {
          matched = filenames.some((filename) =>
            filenamePattern.test(filename)
          );
        } catch (e) {
          console.error(
            `Error while running filename pattern for ${pattern.name}`,
            e
          );
        }
        if (matched) {
          result.totalScore += pattern.score;
          result.matchedPatterns.add(pattern.name);
          if (debug) {
            console.log(
              'Matched: ',
              pattern.name,
              pattern.score,
              filenamePattern,
              ' filename'
            );
          }
        }
      }
    }

    if (pattern.browser) {
      let isMatched = false;
      try {
        isMatched = await pattern.browser(page, browser);
      } catch (e) {
        console.error(
          `Error while running browser pattern for ${pattern.name}`,
          e
        );
      }
      if (isMatched) {
        result.totalScore += pattern.score;
        result.matchedPatterns.add(pattern.name);
        if (debug) {
          console.log('Matched: ', pattern.name, pattern.score, 'Browser');
        }
      }
    }
  }

  return result;
}

export async function calculateResults<
  T extends Record<string, Pattern<string>[]>,
>(
  resources: Resources,
  page: Page,
  browser: Browser,
  patterns: T,
  minConfidence: number = 0.3,
  debug: boolean = false
): Promise<CalculationResult<T>> {
  const results = await Promise.all(
    Object.entries(patterns).map(async ([name, patternList]) => {
      const processed = await processPatterns(
        patternList,
        resources,
        page,
        browser,
        debug
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
