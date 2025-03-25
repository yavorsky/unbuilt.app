import ora from 'ora';
import { Page } from 'playwright';
import { getBrowserContext } from './helpers/get-browser-context';
import { analyze } from '@unbuilt/analyzer';
import { v4 as uuidv4 } from 'uuid';
import { displayResults } from './display-results';
import chalk from 'chalk';
import axios from 'axios';
import { API_BASE_URL } from './constants';

// Run analysis locally using Playwright
export async function runLocalAnalysis(
  url: string,
  options: { json?: boolean; save?: boolean }
): Promise<void> {
  const spinner = ora('Running local analysis using Playwright...').start();

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

      const result = await analyze(
        url,
        uuidv4(),
        page,
        browser,
        (_res, progress) => {
          spinner.text = `Analysis in progress: ${Math.round(progress)}% `;
        }
      );
      spinner.succeed('Analysis completed!');
      displayResults(result, { json: options.json });
      if (options.save) {
        await axios.post(`${API_BASE_URL}/analysis`, result);
        console.log(
          chalk.green(
            `Analysis results: https://unbuilt.app/analyze/${result.id}.`
          )
        );
      }
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
