import { AnalyzeResult } from '@unbuilt/analyzer';
import chalk from 'chalk';
import { Table } from 'console-table-printer';

export function displayResults(
  result: AnalyzeResult,
  options: { json?: boolean } = {}
): void {
  if (!result || !result.analysis) {
    console.log(chalk.yellow('No analysis results available'));
    return;
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log('\n' + chalk.blue.bold('Website Technology Analysis') + '\n');
  console.log(chalk.cyan(`URL: ${result.url}`));
  console.log(
    chalk.cyan(`Timestamp: ${new Date(result.timestamp).toLocaleString()}\n`)
  );

  // Display each category that has data
  for (const [category, data] of Object.entries(result.analysis)) {
    if (data && Object.keys(data).length > 0 && 'name' in data) {
      console.log(
        chalk.green.bold(
          `${capitalize(category)}: ${chalk.bold(data.name) ?? 'Not Detected'} ${data.name ? `(${data.confidence})` : ''}`
        )
      );
      if (
        data.secondaryMatches &&
        Object.keys(data.secondaryMatches).length > 0
      ) {
        const table = new Table();

        for (const [name, detected] of Object.entries(
          data.secondaryMatches ?? {}
        )) {
          table.addRow({
            Secondary: name,
            Confidence: detected.confidence,
          });
        }

        table.printTable();
        console.log(); // Add space between categories
      }
    }
  }

  console.log(chalk.blue('Analysis complete!'));
  process.exit(0);
}

// Helper to capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
