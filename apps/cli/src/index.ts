import { Command, program } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { runRemoteAnalysis } from './run-remote';
import { runLocalAnalysis } from './run-local';
import { getResults } from './get-results';
import { runBatchAnalysis } from './run-batch';
import { normalizeUrl } from '@unbuilt/helpers';

// Read package.json for version info
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Initialize program
program
  .name('unbuilt')
  .description('CLI to analyze technologies used on web apps')
  .version(packageJson.version);

// Create analyze command configuration
const configureAnalyzeCommand = (cmd: Command) => {
  return cmd
    .option(
      '-r, --remote',
      'Run analysis remotely via unbuilt server (by default it will be started locally)'
    )
    .option('-s, --save', 'Save the result to the database')
    .option(
      '-n, --async',
      'Async mode - return job id instead of result and use status command to check it later'
    )
    .option(
      '-r, --refresh',
      'Force a fresh analysis (not use previously saved result)'
    )
    .option(
      '-t, --timeout <seconds>',
      'Max time to wait for analysis to complete',
      '120'
    )
    .option('-j, --json', 'Output results in JSON format');
};

// Function to handle the analyze action
const handleAnalyzeAction = async (
  url: string,
  options: {
    remote?: boolean;
    async?: boolean;
    refresh?: boolean;
    timeout: string;
    save?: boolean;
    json?: boolean;
  }
) => {
  const normalizedUrl = normalizeUrl(url);
  if (options.remote) {
    await runRemoteAnalysis(normalizedUrl, {
      lookupForExisting: !options.refresh,
      async: options.async ?? false,
      timeout: options.timeout,
      json: options.json ?? false,
    });
  } else {
    await runLocalAnalysis(normalizedUrl, {
      json: options.json ?? false,
      save: options.save ?? process.env.UNBUILT_API_KEY !== undefined,
    });
  }
};

// Explicit 'analyze' command
const analyzeCommand = program
  .command('analyze <url>')
  .description('Analyze the technologies used on a website');

configureAnalyzeCommand(analyzeCommand).action(handleAnalyzeAction);

// Default command (when no command is specified)
program
  .arguments('<url>')
  .description('Analyze the technologies used on a website (default command)')
  .action((url, options) => {
    handleAnalyzeAction(url, options);
  });

// Apply the same options to the default command
configureAnalyzeCommand(program);

// New Batch Analysis Command
program
  .command('batch <csvFile>')
  .description('Run local analysis on multiple websites from a CSV file')
  .option('-j, --json', 'Output results in JSON format')
  .option('-s, --save', 'Save the result to the database')
  .option('-o, --output <file>', 'Save results to a specified output file')
  .option(
    '-t, --timeout <seconds>',
    'Max time to wait for each analysis to complete',
    '120'
  )
  .option(
    '-c, --concurrent <number>',
    'Maximum number of concurrent analyses',
    '1'
  )
  .action(
    async (
      csvFile: string,
      options: {
        json?: boolean;
        output?: string;
        timeout: string;
        concurrent: string;
        save?: boolean;
      }
    ) => {
      await runBatchAnalysis(csvFile, {
        json: options.json ?? false,
        outputFile: options.output,
        timeout: parseInt(options.timeout, 10),
        concurrent: parseInt(options.concurrent, 10),
        save: options.save ?? false,
      });
    }
  );

// Check Status Command (remote only)
program
  .command('status <analysisId>')
  .description('Check the status of an ongoing remote analysis')
  .option('-j, --json', 'Output results in JSON format')
  .action(async (analysisId: string, options: { json?: boolean }) => {
    await getResults(analysisId, { json: options.json ?? false });
  });

// Parse command line arguments
program.parse(process.argv);

// Only show help if no arguments were provided at all
if (process.argv.length <= 2) {
  program.outputHelp();
}
