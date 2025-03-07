import { Pattern } from '../../types/pattern.js';
import { ProcessPatternsResult } from '../process-patterns.js';
import { normalizeScore } from './utils.js';

export async function processFilenamePattern<Names extends string>(
  filenamePattern: RegExp,
  pattern: Pattern<Names>,
  filenames: string[],
  result: ProcessPatternsResult<Names>,
  debug?: boolean
): Promise<void> {
  try {
    const matched = await Promise.resolve(
      filenames.some((filename) => filenamePattern.test(filename))
    );

    if (matched) {
      if (debug) {
        console.log(
          `---> Filename pattern ${pattern.name} matched - ${filenamePattern}`
        );
      }
      result.totalScore = normalizeScore(pattern.score + result.totalScore);
      result.matchedPatterns.add(pattern.name);
    }
  } catch (e) {
    console.error(
      `Error while running filename pattern for ${pattern.name}`,
      e
    );
  }
}
