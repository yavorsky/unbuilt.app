import api from './api';
import { AnalysisStatusResponse } from './types';
import ora from 'ora';
import { renderResults } from './render-results';
import chalk from 'chalk';
import { isAxiosError } from 'axios';

export async function getResults(
  analysisId: string,
  options: { json?: boolean } = {}
) {
  const spinner = ora('Checking analysis status...').start();

  try {
    const response = await api.get<AnalysisStatusResponse>(
      `/analysis/${analysisId}`
    );
    const { status, result, progress, error } = response.data;

    if (error) {
      spinner.fail(`Analysis failed: ${error}`);
      process.exit(1);
    }

    if (status === 'completed') {
      spinner.succeed('Analysis completed!');
      if (result) {
        renderResults(result, { json: options.json });
      } else {
        console.log(chalk.yellow('No analysis results available'));
      }
    } else {
      spinner.info(
        `Analysis status: ${status} (${Math.round(progress)}% complete)`
      );
      console.log(
        chalk.yellow(
          `\nCheck again later: web-tech-analyzer status ${analysisId}`
        )
      );
    }
  } catch (err) {
    if (isAxiosError(err)) {
      spinner.fail(`Request failed: ${err.message}`);
    } else {
      spinner.fail(`Unexpected error: ${String(err)}`);
    }
    process.exit(1);
  }
}
