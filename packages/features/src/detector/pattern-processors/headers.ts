import { isMatch } from 'super-regex';
import { Pattern } from '../../types/pattern.js';
import { ProcessPatternsResult } from '../process-patterns.js';
import { normalizeScore } from './utils.js';

export async function processHeaderValue<Names extends string>(
  headerName: string,
  headerValue: RegExp,
  pattern: Pattern<Names>,
  headers: Map<string, string>,
  result: ProcessPatternsResult<Names>,
  debug?: boolean
): Promise<void> {
  try {
    const matchedHeader = headers.get(headerName.toLowerCase());
    const matched = await Promise.resolve(
      !!matchedHeader && isMatch(headerValue, matchedHeader, { timeout: 400 })
    );

    if (matched === undefined && debug) {
      console.log(
        'Timeout while running runtime header pattern',
        pattern.name,
        headerValue
      );
      return;
    }

    if (matched) {
      if (debug) {
        console.log(
          `---> Header pattern ${pattern.name} matched -- ${headerValue}`
        );
      }
      result.totalScore = normalizeScore(pattern.score + result.totalScore);
      result.matchedPatterns.add(pattern.name);
    }
  } catch (e) {
    console.error(`Error while running header pattern for ${pattern.name}`, e);
  }
}
