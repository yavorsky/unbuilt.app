import { Page } from 'playwright';
import { Resources } from './resources.js';
import { Pattern } from './types.js';

type ScoresResult = Record<string, number>;

interface FeatureResult {
  name: string;
  confidence: number;
  matched: Set<string>;
}

interface CalculationResult {
  result: FeatureResult;
  getAllResults(): Record<string, FeatureResult>;
  getResultFor(featureName: string): FeatureResult | null;
}

export class Results<T extends string = string> {
  private resources: Resources;
  private page: Page;
  private patternsPerFeature: Record<T, Pattern[]> = {} as Record<T, Pattern[]>;
  private calculatedResults: Record<string, FeatureResult> | null = null;

  constructor(resources: Resources, page: Page) {
    this.resources = resources;
    this.page = page;
  }

  public withPatterns = (featureName: T, patterns: Pattern[]) => {
    // Score calculation based on pattern matches
    if (!this.patternsPerFeature[featureName]) {
      this.patternsPerFeature[featureName] = [];
    }
    this.patternsPerFeature[featureName].push(...patterns);
  };

  private processPatterns = async (
    featureName: T,
  ) => {
    const content = this.resources.getAllScriptsContent();
    const filenames = Array.from(this.resources.getAllScriptsNames());

    const patterns = this.patternsPerFeature[featureName];
    const results = await Promise.all(patterns.map(async (pattern) => {
      let patternScore = 0;
      const matchedPatterns = new Set<string>();

      if (pattern.runtime) {
        pattern.runtime.forEach((runtimePattern) => {
          if (runtimePattern.test(content)) {
            // TODO: Consider if we should increase score for each match or just 1 per group.
            patternScore += pattern.score;
            matchedPatterns.add(pattern.name);
          }
        });
      }

      if (pattern.filenames) {
        pattern.filenames.forEach((runtimePattern) => {
          const matched = filenames.some(filename => runtimePattern.test(filename));
          if (matched) {
            // TODO: Consider if we should increase score for each match or just 1 per group.
            patternScore += pattern.score;
            matchedPatterns.add(pattern.name);
          }
        });
      }

      if (pattern.browser) {
        const { browser: checkBrowser, score, name } = pattern;
        const isMatched = await this.page!.evaluate(() => {
          return checkBrowser();
        });
        if (isMatched) {
          patternScore += score;
          matchedPatterns.add(name);
        }
      }

      return { patternScore, matchedPatterns, name: pattern.name };
    }));

    return results.reduce((acc, patternResult) => {
      acc.totalScore += patternResult.patternScore;
      acc.matchedPatterns = new Set([...acc.matchedPatterns, ...patternResult.matchedPatterns]);

      return acc;
    }, { totalScore: 0, matchedPatterns: new Set<string>(), featureName });
  };

  public calculate = async (): Promise<CalculationResult> => {
    const results = await Promise.all(
      Object.keys(this.patternsPerFeature).map(async (featureName) => {
        const processed = await this.processPatterns(featureName as T);
        return {
          name: featureName,
          confidence: processed.totalScore,
          matched: processed.matchedPatterns
        };
      })
    );

    // Create a map of all results
    this.calculatedResults = results.reduce((acc, curr) => {
      acc[curr.name] = curr;
      return acc;
    }, {} as Record<string, FeatureResult>);

    // Find the result with highest confidence
    const highestResult = results.reduce((prev, current) => {
      return prev.confidence > current.confidence ? prev : current;
    });

    return {
      result: highestResult,
      getAllResults: () => {
        if (!this.calculatedResults) {
          throw new Error('Results not calculated yet. Call calculate() first.');
        }
        return this.calculatedResults;
      },
      getResultFor: (featureName: string): FeatureResult | null => {
        if (!this.calculatedResults) {
          throw new Error('Results not calculated yet. Call calculate() first.');
        }
        return this.calculatedResults[featureName] || null;
      }
    };
  };
}
