import { Browser, Page } from 'playwright';
import { Pattern } from '../../types/pattern.js';
import { ProcessPatternsResult } from '../process-patterns.js';

export async function processBrowserPattern<Names extends string>(
  pattern: Pattern<Names>,
  page: Page,
  browser: Browser,
  result: ProcessPatternsResult<Names>,
  debug?: boolean
): Promise<void> {
  try {
    const isMatched = await pattern.browser?.(page, browser);

    if (isMatched) {
      if (debug) {
        console.log(`---> Browser pattern ${pattern.name} matched`);
      }
      result.totalScore += pattern.score;
      result.matchedPatterns.add(pattern.name);
    }
  } catch (e) {
    console.error(`Error while running browser pattern for ${pattern.name}`, e);
  }
}
