import ora from 'ora';
import { Page } from 'playwright';
import { getBrowserContext } from './helpers/get-browser-context';
import { analyze } from '@unbuilt/analyzer';
import { v4 as uuidv4 } from 'uuid';
import { displayResults } from './display-results';
import chalk from 'chalk';
import api from './api';

// Run analysis locally using Playwright
export async function runLocalAnalysis(
  url: string,
  options: { json?: boolean; save?: boolean }
): Promise<void> {
  const spinner = ora('Running local analysis...').start();

  try {
    spinner.text = 'Launching browser...';
    let page: Page | null = null;
    // Setup browser and page
    try {
      const context = await getBrowserContext();
      const browser = await context.browser();
      page = (await context?.newPage()) ?? null;

      if (!page || !browser) {
        throw new Error('Page is not defined');
      }

      const analysisId = uuidv4();

      const result = await analyze(
        url,
        analysisId,
        page,
        browser,
        (_res, progress) => {
          spinner.text = `Analysis in progress: ${Math.round(progress)}% `;
        }
      );

      if (options.save) {
        if (process.env.UNBUILT_API_KEY) {
          await api.post('/analysis', result);
        } else {
          console.warn(
            chalk.red('\n ⚠️ Skipping save: UNBUILT_API_KEY not set')
          );
        }
      }
      displayResults(result, { json: options.json });
      spinner.succeed('Analysis completed!');
    } catch (error: unknown) {
      if (page) await page?.close();
      throw error;
    } finally {
      await page?.close();
    }

    process.exit(0);
  } catch (err) {
    spinner.fail(`Local analysis failed: ${(err as Error).message}`);
    console.error(chalk.red('Error details:'));
    console.error(err);
    process.exit(1);
  }
}
