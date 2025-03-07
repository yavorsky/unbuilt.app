import { Pattern } from '../../types/pattern.js';
import { isMatch } from 'super-regex';
import { ProcessPatternsResult } from '../process-patterns.js';
import { normalizeScore } from './utils.js';

export async function processDocumentPattern<Names extends string>(
  runtimePattern: RegExp,
  pattern: Pattern<Names>,
  documentsContent: string,
  result: ProcessPatternsResult<Names>,
  debug?: boolean
): Promise<void> {
  try {
    const matched = await Promise.resolve(
      isMatch(runtimePattern, documentsContent, { timeout: 400 })
    );

    if (matched === undefined) {
      console.log(
        'Timeout while running runtime document pattern',
        pattern.name,
        runtimePattern
      );
      return;
    }

    if (matched) {
      if (debug) {
        console.log(
          `---> Document pattern ${pattern.name} matched -- ${runtimePattern}`
        );
      }
      result.totalScore = normalizeScore(pattern.score + result.totalScore);
      result.matchedPatterns.add(pattern.name);
    }
  } catch (e) {
    console.error(
      `Error while running document pattern for ${pattern.name}`,
      e
    );
  }
}
