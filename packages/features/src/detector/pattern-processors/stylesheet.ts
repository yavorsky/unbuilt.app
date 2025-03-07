import { Pattern } from '../../types/pattern.js';
import { ProcessPatternsResult } from '../process-patterns.js';
import { normalizeScore } from './utils.js';

export async function processStylesheetPattern<Names extends string>(
  runtimePattern: RegExp,
  pattern: Pattern<Names>,
  styleSheetsContent: string,
  result: ProcessPatternsResult<Names>,
  debug?: boolean
): Promise<void> {
  try {
    const matched = await Promise.resolve(
      runtimePattern.test(styleSheetsContent)
    );

    if (matched) {
      if (debug) {
        console.log(
          `---> Stylesheet pattern ${pattern.name} matched -- ${runtimePattern}`
        );
      }
      result.totalScore = normalizeScore(pattern.score + result.totalScore);
      result.matchedPatterns.add(pattern.name);
    }
  } catch (e) {
    console.error(
      `Error while running stylesheet pattern for ${pattern.name}`,
      e
    );
  }
}
