import ora from 'ora';
import axios from 'axios';
import api from './api';
import { AnalyzeResult } from '@unbuilt/analyzer';
import chalk from 'chalk';
import { renderResults } from './render-results';
import { AnalysisStatusResponse } from './types';
import EventSource from 'eventsource';

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
    const response = await api.post<AnalysisResponse>(`/analyze`, {
      url,
      lookupForExisting: options.lookupForExisting,
    });

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

    // If wait option is specified, use SSE streaming for real-time updates
    if (!options.async) {
      const waitSpinner = ora('Waiting for analysis to complete...').start();
      const startTime = Date.now();
      const timeoutMs = parseInt(options.timeout) * 1000;

      let completed = false;
      let results: AnalyzeResult | null = null;

      await new Promise<void>((resolve, reject) => {
        // Get base URL from axios instance
        const baseURL = api.defaults.baseURL || '';
        const streamUrl = `${baseURL}/analysis/${analysisId}/stream`;

        const eventSource = new EventSource(streamUrl);

        // Set up timeout
        const timeout = setTimeout(() => {
          eventSource.close();
          if (!completed) {
            waitSpinner.fail(`Analysis timed out after ${options.timeout} seconds`);
            console.log(
              chalk.yellow(
                `You can check results later with: unbuilt status ${analysisId}`
              )
            );
            reject(new Error('Timeout'));
          }
        }, timeoutMs);

        eventSource.addEventListener('connected', () => {
          // Connection established
        });

        eventSource.addEventListener('status', (event: any) => {
          try {
            const statusData: AnalysisStatusResponse = JSON.parse(event.data);
            const { status, result, progress, error } = statusData;

            if (error) {
              clearTimeout(timeout);
              eventSource.close();
              waitSpinner.fail(`Analysis failed: ${error}`);
              reject(new Error(error));
              return;
            }

            waitSpinner.text = `Analysis in progress: ${Math.round(progress)}%`;

            if (status === 'completed') {
              clearTimeout(timeout);
              completed = true;
              results = result;
              eventSource.close();
              waitSpinner.succeed('Analysis completed!');
              resolve();
            } else if (status === 'failed') {
              clearTimeout(timeout);
              eventSource.close();
              waitSpinner.fail(`Analysis failed: ${error || 'Unknown error'}`);
              reject(new Error(error || 'Analysis failed'));
            }
          } catch (err) {
            clearTimeout(timeout);
            eventSource.close();
            waitSpinner.fail(`Error parsing status: ${String(err)}`);
            reject(err);
          }
        });

        eventSource.addEventListener('error', (event: any) => {
          try {
            const errorData = JSON.parse(event.data);
            clearTimeout(timeout);
            eventSource.close();
            waitSpinner.fail(`Analysis error: ${errorData.message}`);
            reject(new Error(errorData.message));
          } catch {
            // Connection error
            clearTimeout(timeout);
            eventSource.close();
            waitSpinner.fail('Connection error occurred');
            reject(new Error('Connection error'));
          }
        });

        eventSource.addEventListener('close', () => {
          clearTimeout(timeout);
          eventSource.close();
        });

        eventSource.onerror = (err: any) => {
          // Network error or connection closed
          clearTimeout(timeout);
          eventSource.close();
          if (!completed) {
            waitSpinner.fail(`Connection error: ${err.message || 'Unknown error'}`);
            reject(new Error('Connection error'));
          }
        };
      });

      if (results) {
        renderResults(results, { json: options.json });
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
