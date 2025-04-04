import { AnalyzeResult } from '@unbuilt/analyzer';
import chalk from 'chalk';
import boxen from 'boxen';
import { Table } from 'console-table-printer';
import { getConfidenceBarInfo } from '@unbuilt/helpers';
import { getBaseUrl } from './constants';

// Function to create a confidence bar visualization
function confidenceBar(confidence: number): string {
  const { maxBars, bars, percentage } = getConfidenceBarInfo(confidence);

  const filled = '█'.repeat(bars);
  const empty = '░'.repeat(maxBars - bars);

  let color;
  if (confidence >= 7) color = chalk.green;
  else if (confidence >= 4) color = chalk.yellow;
  else color = chalk.red;

  return `${color(filled + empty)} ${percentage}%`;
}

// Helper to capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function renderResults(
  result: AnalyzeResult,
  options: { json?: boolean; isSaved?: boolean } = {}
): void {
  if (!result || !result.analysis) {
    console.log(chalk.yellow('No analysis results available'));
    return;
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // Website info box
  const websiteInfoBox = boxen(
    `${chalk.bold.underline('Website:')} ${chalk.cyan(result.url)}\n` +
      `${chalk.bold.underline('Analysis ID:')} ${chalk.gray(result.id)}\n` +
      `${chalk.bold.underline('Timestamp:')} ${chalk.magenta(new Date(result.timestamp).toLocaleString())}\n` +
      `${chalk.bold.underline('Duration:')} ${chalk.yellow(result.duration + 'ms')}`,
    {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: 'round',
      borderColor: 'blue',
    }
  );

  console.log(websiteInfoBox);

  // Create tech stack table
  console.log('\n' + chalk.bold.magenta('📋 TECH STACK ANALYSIS'));
  const techStackTable = new Table({
    columns: [
      {
        name: 'type',
        title: chalk.bold.white('Technology Type'),
        alignment: 'left',
      },
      {
        name: 'name',
        title: chalk.bold.white('Primary Tech'),
        alignment: 'left',
      },
      {
        name: 'confidence',
        title: chalk.bold.white('Confidence'),
        alignment: 'left',
      },
      {
        name: 'secondary',
        title: chalk.bold.white('Secondary Matches'),
        alignment: 'left',
      },
    ],
  });

  // Categorize technologies as known and unknown
  const knownTechs: string[] = [];
  const unknownTechs: string[] = [];

  for (const category of Object.keys(result.analysis)) {
    const tech = result.analysis[category as keyof typeof result.analysis];
    // Skip categories that don't match the expected structure
    if (!tech || typeof tech !== 'object' || !('name' in tech)) {
      continue;
    }

    if (tech.name === 'unknown' && tech.confidence === 0) {
      unknownTechs.push(category);
    } else {
      knownTechs.push(category);
    }
  }

  // Add known technologies to the table
  for (const category of knownTechs) {
    const tech = result.analysis[category as keyof typeof result.analysis];
    if (!tech || !('name' in tech)) continue;

    // Get secondary matches, if any
    let secondaryMatches = '';
    if (
      tech.secondaryMatches &&
      Object.keys(tech.secondaryMatches).length > 0
    ) {
      secondaryMatches = Object.entries(tech.secondaryMatches)
        .map(([name, details]) => {
          const { percentage } = getConfidenceBarInfo(details.confidence ?? 0);
          return `${name} (${percentage}%)`;
        })
        .join(', ');
    }

    techStackTable.addRow({
      type: chalk.cyan(capitalize(category)),
      name:
        tech.name === 'unknown'
          ? chalk.gray('Unknown')
          : chalk.green(tech.name),
      confidence: confidenceBar(tech.confidence ?? 0),
      secondary: chalk.yellow(secondaryMatches),
    });
  }

  // Add unknown technologies to the bottom
  for (const category of unknownTechs) {
    const tech = result.analysis[category as keyof typeof result.analysis];
    if (!tech) continue;

    techStackTable.addRow({
      type: chalk.cyan(capitalize(category)),
      name: chalk.gray('Unknown'),
      confidence: confidenceBar(0),
      secondary: '',
    });
  }

  techStackTable.printTable();

  // Handle special cases like stylingLibraries
  if (
    result.analysis.stylingLibraries &&
    'items' in result.analysis.stylingLibraries
  ) {
    console.log('\n' + chalk.bold.magenta('🎨 STYLING LIBRARIES'));
    const stylingTable = new Table({
      columns: [
        {
          name: 'library',
          title: chalk.bold.white('Styling Library'),
          alignment: 'left',
        },
        {
          name: 'confidence',
          title: chalk.bold.white('Confidence'),
          alignment: 'left',
        },
      ],
    });

    const items = result.analysis.stylingLibraries.items;

    if (items) {
      for (const [library, details] of Object.entries(items)) {
        stylingTable.addRow({
          library: chalk.green(library),
          confidence: confidenceBar(details.confidence ?? 0),
        });
      }

      stylingTable.printTable();
    }
  }

  // Site statistics
  if (result.analysis.stats) {
    const stats = result.analysis.stats;
    console.log('\n' + chalk.bold.magenta('📊 SITE STATISTICS'));
    const statsTable = new Table({
      columns: [
        {
          name: 'statistic',
          title: chalk.bold.white('Statistic'),
          alignment: 'left',
        },
        { name: 'value', title: chalk.bold.white('Value'), alignment: 'left' },
      ],
    });

    statsTable.addRow({
      statistic: chalk.cyan('Total Resources'),
      value: chalk.yellow(stats.resourceCount),
    });

    if (stats.domMetrics) {
      statsTable.addRow({
        statistic: chalk.cyan('DOM Nodes'),
        value: chalk.yellow(stats.domMetrics.totalNodes),
      });

      statsTable.addRow({
        statistic: chalk.cyan('DOM Max Depth'),
        value: chalk.yellow(stats.domMetrics.maxDepth),
      });

      statsTable.addRow({
        statistic: chalk.cyan('DOM Size'),
        value: chalk.yellow(
          (stats.domMetrics.totalSize / 1024).toFixed(2) + ' KB'
        ),
      });
    }

    if (stats.scriptMetrics) {
      statsTable.addRow({
        statistic: chalk.cyan('Scripts (Async/Defer/Inline)'),
        value: chalk.yellow(
          `${stats.scriptMetrics.async}/${stats.scriptMetrics.defer}/${stats.scriptMetrics.inline}`
        ),
      });
    }

    if (stats.styleMetrics) {
      statsTable.addRow({
        statistic: chalk.cyan('Styles (Total/Inline)'),
        value: chalk.yellow(
          `${stats.styleMetrics.total}/${stats.styleMetrics.inline}`
        ),
      });
    }

    if (stats.imageMetrics) {
      statsTable.addRow({
        statistic: chalk.cyan('Images'),
        value: chalk.yellow(stats.imageMetrics.total),
      });
    }

    statsTable.printTable();
    console.log('');
  }

  // Footer
  console.log(
    boxen(
      chalk.italic('Analysis completed in ') +
        chalk.bold.yellow(result.duration + 'ms') +
        chalk.italic(' on ') +
        chalk.bold.cyan(new Date(result.timestamp).toLocaleString()) +
        (options.isSaved
          ? chalk.italic('\n🔗 Analysis URL: ') +
            chalk.bold.cyan(`${getBaseUrl()}/analysis/${result.id}`)
          : ''),
      { borderStyle: 'single', padding: 1, borderColor: 'blue' }
    )
  );
}
