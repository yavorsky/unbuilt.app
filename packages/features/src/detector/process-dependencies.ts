import { AnalysisFeatures } from '../types/analysis.js';
import { Pattern } from '../types/pattern.js';
import { ProcessPatternsResult } from './process-patterns.js';

export function processDependencies<Names extends string>(
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
