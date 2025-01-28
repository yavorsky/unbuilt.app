import { Resources } from '@unbuilt/resources';
import { Browser, Page } from 'playwright';
import { isMatch } from 'super-regex';
import { AnalysisFeatures, AnalysisKeys } from '../types/analysis.js';

export interface Pattern<Name extends string = string> {
  score: number;
  name: Name;
  scripts?: RegExp[];
  stylesheets?: RegExp[];
  documents?: RegExp[];
  headers?: Record<string, RegExp>;
  filenames?: RegExp[];
  browser?: (page: Page, browser: Browser) => boolean | Promise<boolean>;
  dependencies?: (analysis: AnalysisFeatures) => boolean;
}

type InferPatternNames<T> = T extends Pattern<infer Name>[] ? Name : never;

export type AllPatternNames<T> = {
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

type ProcessPatternsResult<Names extends string> = {
  totalScore: number;
  matchedPatterns: Set<Names>;
};

async function processPatterns<Names extends string>(
  patterns: Pattern<Names>[],
  resources: Resources,
  page: Page,
  browser: Browser,
  debug: boolean = false,
  type: string = ''
): Promise<ProcessPatternsResult<Names>> {
  const scriptsContent = resources.getAllScriptsContent();
  const stylesheetsContent = resources.getAllScriptsContent();
  const documentsContent = resources.getAllScriptsContent();
  const totalContent = scriptsContent + stylesheetsContent + documentsContent;
  const filenames = Array.from(resources.getAllScriptsNames());

  const result = {
    totalScore: 0,
    matchedPatterns: new Set<Names>(),
  };

  for (const pattern of patterns) {
    if (pattern.scripts) {
      if (debug) {
        console.time(`scripts ${type}`);
      }
      for (const runtimePattern of pattern.scripts) {
        let matched = false;
        try {
          matched = isMatch(runtimePattern, totalContent, { timeout: 500 });
          if (matched === undefined) {
            console.log(
              'Timeout while running runtime script pattern',
              pattern.name,
              runtimePattern
            );
          }
        } catch (e) {
          console.error(
            `Error while running filename pattern for ${pattern.name}`,
            e
          );
        }

        if (matched) {
          result.totalScore += pattern.score;
          result.matchedPatterns.add(pattern.name);
          // if (debug) {
          //   console.log(
          //     'Matched runtime scripts: ',
          //     pattern.name,
          //     pattern.score,
          //     runtimePattern
          //   );
          // }
        }
      }
      if (debug) {
        console.timeEnd(`scripts ${type}`);
      }
    }

    if (pattern.stylesheets) {
      if (debug) {
        console.time(`stylesheets ${type}`);
      }
      for (const runtimePattern of pattern.stylesheets) {
        let matched = false;
        try {
          matched = runtimePattern.test(totalContent);
        } catch (e) {
          console.error(
            `Error while running filename pattern for ${pattern.name}`,
            e
          );
        }

        if (matched) {
          result.totalScore += pattern.score;
          result.matchedPatterns.add(pattern.name);
          // if (debug) {
          //   console.log(
          //     'Matched runtime stylesheets: ',
          //     pattern.name,
          //     pattern.score,
          //     runtimePattern
          //   );
          // }
        }
      }
      if (debug) {
        console.timeEnd(`stylesheets ${type}`);
      }
    }

    if (pattern.filenames) {
      if (debug) {
        console.time(`filenames ${type}`);
      }
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
          // if (debug) {
          //   console.log(
          //     'Matched filenames: ',
          //     pattern.name,
          //     pattern.score,
          //     filenamePattern
          //   );
          // }
        }
      }
      if (debug) {
        console.timeEnd(`filenames ${type}`);
      }
    }

    if (pattern.browser) {
      if (debug) {
        console.time(`browser ${type}`);
      }
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
        // if (debug) {
        //   console.log('Matched Browser: ', pattern.name, pattern.score);
        // }
      }
      if (debug) {
        console.timeEnd(`browser ${type}`);
      }
    }
  }

  return result;
}

// Let's keep it sync specifically to not decrease performance
function processOnAnalyzePatterns<Names extends string>(
  patterns: Pattern<Names>[],
  previousResult: ProcessPatternsResult<Names>,
  analysis: AnalysisFeatures,
  debug: boolean = false
): ProcessPatternsResult<Names> {
  const result = {
    totalScore: previousResult.totalScore,
    matchedPatterns: previousResult.matchedPatterns,
  };

  for (const pattern of patterns) {
    if (pattern.dependencies) {
      let isMatched = false;
      try {
        isMatched = pattern.dependencies(analysis);
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
          console.log('Matched Browser: ', pattern.name, pattern.score);
        }
      }
    }
  }

  return result;
}

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

      // Second calculation
      if (analysis && featureScore) {
        processed = processOnAnalyzePatterns(
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
