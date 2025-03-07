import { Pattern } from '../../types/pattern.js';
import { isMatch } from 'super-regex';
import { ProcessPatternsResult } from '../process-patterns.js';
import { normalizeScore } from './utils.js';

export async function processScriptPattern<Names extends string>(
  runtimePattern: RegExp,
  pattern: Pattern<Names>,
  scriptsContent: string,
  result: ProcessPatternsResult<Names>,
  debug?: boolean
): Promise<void> {
  try {
    const matched = await Promise.resolve(
      isMatch(runtimePattern, scriptsContent, { timeout: 400 })
    );

    if (matched === undefined) {
      console.log(
        'Timeout while running runtime script pattern',
        pattern.name,
        runtimePattern
      );
      return;
    }

    if (matched) {
      if (debug) {
        console.log(
          `---> Script pattern ${pattern.name} matched -- ${runtimePattern}`
        );
      }
      result.totalScore = normalizeScore(pattern.score + result.totalScore);
      result.matchedPatterns.add(pattern.name);
    }
  } catch (e) {
    console.error(`Error while running script pattern for ${pattern.name}`, e);
  }
}
