import { Pattern } from '../../types/pattern.js';
import { isMatch } from 'super-regex';
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
      isMatch(runtimePattern, styleSheetsContent, { timeout: 400 })
    );

    if (matched === undefined) {
      console.log(
        'Timeout while running runtime stylesheet pattern',
        pattern.name,
        runtimePattern
      );
      return;
    }

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
