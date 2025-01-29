import { Browser, Page } from 'playwright';
import { Pattern } from '../types/pattern.js';
import { ProcessPatternsResult } from './process-patterns.js';
import { processScriptPattern } from './pattern-processors/script.js';
import { processStylesheetPattern } from './pattern-processors/stylesheet.js';
import { processBrowserPattern } from './pattern-processors/browser.js';
import { processFilenamePattern } from './pattern-processors/filename.js';

export async function processPattern<Names extends string>(
  pattern: Pattern<Names>,
  context: {
    totalContent: string;
    filenames: string[];
    page: Page;
    browser: Browser;
    debug: boolean;
    type: string;
    result: ProcessPatternsResult<Names>;
  }
): Promise<void> {
  const { totalContent, filenames, page, browser, debug, type, result } =
    context;

  // 1. Process scripts
  if (pattern.scripts) {
    if (debug) {
      console.time(`scripts ${type} ${pattern.name}`);
    }

    // Process each script pattern sequentially
    for (const runtimePattern of pattern.scripts) {
      await processScriptPattern(
        runtimePattern,
        pattern,
        totalContent,
        result,
        debug
      );
    }

    if (debug) {
      console.timeEnd(`scripts ${type} ${pattern.name}`);
    }
  }

  // 2. Process stylesheets
  if (pattern.stylesheets) {
    if (debug) {
      console.time(`stylesheets ${type} ${pattern.name}`);
    }

    // Process each stylesheet pattern sequentially
    for (const runtimePattern of pattern.stylesheets) {
      await processStylesheetPattern(
        runtimePattern,
        pattern,
        totalContent,
        result,
        debug
      );
    }

    if (debug) {
      console.timeEnd(`stylesheets ${type} ${pattern.name}`);
    }
  }

  // 3. Process filenames
  if (pattern.filenames) {
    if (debug) {
      console.time(`filenames ${type} ${pattern.name}`);
    }

    // Process each filename pattern sequentially
    for (const filenamePattern of pattern.filenames) {
      await processFilenamePattern(
        filenamePattern,
        pattern,
        filenames,
        result,
        debug
      );
    }

    if (debug) {
      console.timeEnd(`filenames ${type} ${pattern.name}`);
    }
  }

  // 4. Process browser check
  if (pattern.browser) {
    if (debug) {
      console.time(`browser ${type} ${pattern.name}`);
    }

    await processBrowserPattern(pattern, page, browser, result, debug);

    if (debug) {
      console.timeEnd(`browser ${type} ${pattern.name}`);
    }
  }
}
