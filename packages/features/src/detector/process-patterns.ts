import { Resources } from '@unbuilt/resources';
import { Pattern } from '../types/pattern.js';
import { Browser, Page } from 'playwright';
import { processPattern } from './process-pattern.js';

export type ProcessPatternsResult<Names extends string> = {
  totalScore: number;
  matchedPatterns: Set<Names>;
};

export async function processPatterns<Names extends string>(
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

  // Process each pattern sequentially
  for (const pattern of patterns) {
    await processPattern(pattern, {
      totalContent,
      filenames,
      page,
      browser,
      debug,
      type,
      result,
    });
  }

  if (debug) {
    console.log(Array.from(result.matchedPatterns));
  }

  return result;
}
