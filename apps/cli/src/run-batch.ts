import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import ora from 'ora';
import chalk from 'chalk';
import { Page } from 'playwright';
import { BrowserManager, normalizeUrl } from '@unbuilt/helpers';
import {
  AnalysisFeaturesWithStats,
  analyze,
  AnalyzeResult,
} from '@unbuilt/analyzer';
import { v4 as uuidv4 } from 'uuid';
import { renderResults } from './render-results';
import PQueue from 'p-queue';
import api from './api';

interface BatchAnalysisOptions {
  json?: boolean;
  outputFile?: string;
  timeout: number;
  concurrent: number;
  save?: boolean;
}

interface AnalysisResult {
  url: string;
  success: boolean;
  result?: AnalyzeResult;
  error?: string;
  duration?: number;
}

export async function runBatchAnalysis(
  csvFilePath: string,
  options: BatchAnalysisOptions
): Promise<void> {
  const spinner = ora('Starting batch analysis...').start();

  // Check if file exists
  if (!fs.existsSync(csvFilePath)) {
    spinner.fail(`CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  try {
    // Read and parse CSV file
    spinner.text = 'Reading CSV file...';
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');

    // Parse CSV - expecting a column named 'url' or the first column to contain URLs
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0) {
      spinner.fail('No URLs found in the CSV file.');
      process.exit(1);
    }

    // Extract URLs from the CSV
    const urls: string[] = records
      .map((record: { url?: string }) => {
        // Try to get URL from 'url' field or from the first value if it's an array
        return (
          record.url ||
          (Array.isArray(record) ? record[0] : Object.values(record)[0])
        );
      })
      .map((url: string) => normalizeUrl(url))
      .filter(Boolean);

    spinner.text = `Found ${urls.length} URLs to analyze`;

    // Set up concurrency queue
    const queue = new PQueue({ concurrency: options.concurrent });
    const results: AnalysisResult[] = [];
    let completedCount = 0;

    // Set up browser manager with multiple instances
    spinner.text = `Launching ${options.concurrent} browser instances...`;
    const browserManager = new BrowserManager();
    await browserManager.initialize(
      options.concurrent,
      (error) => console.error(chalk.red(`Browser error: ${error.message}`)),
      true
    );

    // Create a function to update the spinner
    const updateSpinner = () => {
      spinner.text = `Processing: ${completedCount}/${urls.length} URLs completed`;
    };

    // Process each URL
    for (const url of urls) {
      queue.add(async () => {
        const startTime = Date.now();
        let page: Page | null = null;
        let context = null;

        try {
          // Get a fresh browser context for each URL
          context = await browserManager.getBrowserContext();
          page = await context.newPage();
          const browser = context.browser();
          if (!browser || !page) {
            throw new Error('Page or Browser is not defined');
          }

          const result = await analyze(
            url,
            uuidv4(),
            page,
            browser,
            (_res, _progress) => {},
            () => {}
          );

          if (options.save) {
            if (process.env.UNBUILT_API_KEY) {
              await api.post('/analysis', result);
            } else {
              console.warn('Skipping save: UNBUILT_API_KEY not set');
              return;
            }
          }

          const duration = Date.now() - startTime;

          // Just store the result - we'll display at the end to match local analysis behavior
          results.push({
            url,
            success: true,
            result,
            duration,
          });

          console.log(
            chalk.green(`\n✓ ${url} - Analysis completed (${duration}ms)`)
          );
        } catch (error) {
          const duration = Date.now() - startTime;

          results.push({
            url,
            success: false,
            error: (error as Error).message,
            duration,
          });

          console.log(
            chalk.red(`✗ ${url} - Failed: ${(error as Error).message}`)
          );
        } finally {
          if (page) await page.close();
          if (context) await context.close();
          completedCount++;
          updateSpinner();
        }
      });
    }

    // Wait for all tasks to complete
    await queue.onIdle();

    // Clean up all browser instances
    await browserManager.cleanup();

    // Display summary
    spinner.succeed(
      `Batch analysis completed. ${results.filter((r) => r.success).length}/${urls.length} successful.`
    );

    // Summary statistics
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log('\nSummary:');
    console.log(`Total URLs: ${urls.length}`);
    console.log(`Successful: ${chalk.green(successful.length)}`);
    console.log(`Failed: ${chalk.red(failed.length)}`);

    // If not JSON output, display detailed results for each successful analysis
    if (!options.json && !options.outputFile) {
      console.log('\nDetailed Results:');
      successful.forEach((result, index) => {
        console.log(
          `\n${chalk.cyan.bold(`Result ${index + 1}/${successful.length}: ${result.url}`)}`
        );
        renderResults(result.result!, { json: false });
      });
    }

    // Save to output file if specified
    if (options.outputFile) {
      const outputData = options.json
        ? JSON.stringify(results, null, 2)
        : formatResultsAsCSV(results);

      const extension = options.json ? '.json' : '.csv';
      const outputPath = options.outputFile.endsWith(extension)
        ? options.outputFile
        : `${options.outputFile}${extension}`;

      fs.writeFileSync(outputPath, outputData);
      console.log(chalk.blue(`\nResults saved to: ${outputPath}`));
    }

    // If JSON output is requested, use the same format as displayResults
    if (options.json) {
      // Format each result in the format expected by displayResults
      successful.forEach((result) => {
        if (result.result) {
          console.log(`\n--- Result for ${result.url} ---`);
          renderResults(result.result, { json: true });
        }
      });
    }
  } catch (err) {
    spinner.fail(`Batch analysis failed: ${(err as Error).message}`);
    console.error(chalk.red('Error details:'));
    console.error(err);
    process.exit(1);
  }
}

// Helper function to format results as CSV
function formatResultsAsCSV(results: AnalysisResult[]): string {
  // Basic header for all results
  let header = 'url,success,duration_ms,error';

  // Find all categories from successful analyses
  const categories = new Set<string>();
  results.forEach((data) => {
    if (data.success && data.result && data.result.analysis) {
      Object.keys(data.result.analysis).forEach((category) => {
        categories.add(category);
      });
    }
  });

  // Add categories to header
  if (categories.size > 0) {
    header += `,${Array.from(categories).join(',')}`;
  }

  // Create rows
  const rows = results.map((data) => {
    let row = `"${data.url}",${data.success},${data.duration || ''},"${data.error || ''}"`;

    if (data.success && data.result && data.result.analysis) {
      // Add each category's detected technology
      Array.from(categories).forEach((category) => {
        const categoryData =
          data.result?.analysis[category as keyof AnalysisFeaturesWithStats];
        const value =
          categoryData && 'name' in categoryData && categoryData.name
            ? `"${categoryData.name} (${categoryData.confidence})"`
            : '""';
        row += `,${value}`;
      });
    } else if (categories.size > 0) {
      // Fill with empty values for failed analyses
      row += `,${Array(categories.size).fill('""').join(',')}`;
    }

    return row;
  });

  return `${header}\n${rows.join('\n')}`;
}
