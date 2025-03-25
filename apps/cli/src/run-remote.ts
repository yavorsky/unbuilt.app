import ora from 'ora';
import axios from 'axios';
import { AnalyzeResult } from '@unbuilt/analyzer';
import chalk from 'chalk';
import { displayResults } from './display-results';
import { AnalysisStatusResponse } from './types';
import { API_BASE_URL } from './constants';

interface AnalysisResponse {
  analysisId?: string;
  error?: string;
}

export async function runRemoteAnalysis(
  url: string,
  options: {
    lookupForExisting: boolean;
    async: boolean;
    timeout: string;
    json?: boolean;
  }
): Promise<void> {
  const spinner = ora('Starting remote analysis...').start();

  try {
    // Start the analysis
    const response = await axios.post<AnalysisResponse>(
      `${API_BASE_URL}/analyze`,
      {
        url,
        lookupForExisting: options.lookupForExisting,
      }
    );

    const { analysisId, error } = response.data;

    if (error) {
      spinner.fail(`Error: ${error}`);
      process.exit(1);
    }

    if (!analysisId) {
      spinner.fail('No analysis ID was returned');
      process.exit(1);
    }

    spinner.succeed(`Analysis started with ID: ${analysisId}`);

    // If wait option is specified, poll for results
    if (!options.async) {
      const waitSpinner = ora('Waiting for analysis to complete...').start();
      const startTime = Date.now();
      const timeoutMs = parseInt(options.timeout) * 1000;

      let completed = false;
      let results: AnalyzeResult | null = null;

      while (!completed && Date.now() - startTime < timeoutMs) {
        try {
          const statusResponse = await axios.get<AnalysisStatusResponse>(
            `${API_BASE_URL}/analysis/${analysisId}`
          );
          const { status, result, progress, error } = statusResponse.data;

          if (error) {
            waitSpinner.fail(`Analysis failed: ${error}`);
            process.exit(1);
          }

          waitSpinner.text = `Analysis in progress: ${Math.round(progress)}%`;

          if (status === 'completed') {
            completed = true;
            results = result;
          } else {
            // Wait for 1 second before checking again
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            waitSpinner.fail(`Error checking status: ${err.message}`);
          } else {
            waitSpinner.fail(`Unexpected error: ${String(err)}`);
          }
          process.exit(1);
        }
      }

      if (!completed) {
        waitSpinner.fail(`Analysis timed out after ${options.timeout} seconds`);
        console.log(
          chalk.yellow(
            `You can check results later with: web-tech-analyzer status ${analysisId}`
          )
        );
        process.exit(1);
      }

      waitSpinner.succeed('Analysis completed!');
      if (results) {
        displayResults(results, { json: options.json });
      } else {
        console.log(chalk.red('No analysis results available'));
      }
    } else {
      console.log(
        chalk.green(
          `\nTo check status run: ${chalk.blueBright('unbuilt status ' + analysisId)}`
        )
      );
    }
    process.exit(0);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      spinner.fail(`Request failed: ${err.message}`);
    } else {
      spinner.fail(`Unexpected error: ${String(err)}`);
    }
    process.exit(1);
  }
}
