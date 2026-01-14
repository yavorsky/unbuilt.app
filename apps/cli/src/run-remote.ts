import ora from 'ora';
import axios from 'axios';
import api from './api';
import { AnalyzeResult } from '@unbuilt/analyzer';
import chalk from 'chalk';
import { renderResults } from './render-results';
import { AnalysisStatusResponse } from './types';
import { getBaseAPIUrl } from './constants';

interface AnalysisResponse {
  analysisId?: string;
  error?: string;
}

interface SSEMessage {
  type: 'status' | 'error';
  data?: AnalysisStatusResponse;
  error?: string;
}

async function waitForAnalysisSSE(
  analysisId: string,
  timeoutMs: number,
  waitSpinner: ReturnType<typeof ora>
): Promise<{ completed: boolean; results: AnalyzeResult | null }> {
  return new Promise((resolve) => {
    const baseUrl = getBaseAPIUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      resolve({ completed: false, results: null });
    }, timeoutMs);

    (async () => {
      try {
        const response = await fetch(
          `${baseUrl}/analysis/${analysisId}/stream`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'text/event-stream',
            },
          }
        );

        if (!response.ok || !response.body) {
          clearTimeout(timeoutId);
          waitSpinner.fail(`Failed to connect to SSE stream`);
          process.exit(1);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const message: SSEMessage = JSON.parse(line.slice(6));

                if (message.type === 'error') {
                  clearTimeout(timeoutId);
                  waitSpinner.fail(`Analysis failed: ${message.error}`);
                  process.exit(1);
                }

                if (message.type === 'status' && message.data) {
                  const { status, result, progress, error } = message.data;

                  if (error) {
                    clearTimeout(timeoutId);
                    waitSpinner.fail(`Analysis failed: ${error}`);
                    process.exit(1);
                  }

                  waitSpinner.text = `Analysis in progress: ${Math.round(progress)}%`;

                  if (status === 'completed') {
                    clearTimeout(timeoutId);
                    resolve({ completed: true, results: result });
                    return;
                  }

                  if (status === 'failed') {
                    clearTimeout(timeoutId);
                    waitSpinner.fail(`Analysis failed`);
                    process.exit(1);
                  }
                }
              } catch {
                // Ignore parse errors for incomplete messages
              }
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return; // Timeout handled above
        }
        clearTimeout(timeoutId);
        waitSpinner.fail(`SSE connection error: ${String(err)}`);
        process.exit(1);
      }
    })();
  });
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

    // If wait option is specified, use SSE for real-time updates
    if (!options.async) {
      const waitSpinner = ora('Waiting for analysis to complete...').start();
      const timeoutMs = parseInt(options.timeout) * 1000;

      const { completed, results } = await waitForAnalysisSSE(
        analysisId,
        timeoutMs,
        waitSpinner
      );

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
