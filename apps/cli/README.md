# Unbuilt CLI Documentation

@unbuilt/cli is a command-line tool for analyzing the technologies used on websites. It can detect frameworks, libraries, and other technical details by analyzing the structure and content of web applications.

## Installation

```bash
npm install -g unbuilt
```

### Prerequisites

For local (default) analysis mode, Playwright is required:

```bash
# Install Playwright browsers
npx playwright install chromium
```

This is necessary because Unbuilt uses a headless browser to visit websites and analyze their technology stack. The remote analysis mode doesn't require Playwright to be installed locally as it runs on the Unbuilt server.

## Commands

Unbuilt CLI provides three main commands:

- `analyze`: Analyze a single website. (the analyze keyword can be omitted - `unbuilt mysite.com`)
- `batch`: Analyze multiple websites from a CSV file
- `status`: Check the status of an ongoing remote analysis

## Analyzing a Single Website

### Basic Usage

```bash
unbuilt https://example.com
```
or
```bash
unbuilt analyze https://example.com
```

This will analyze the website locally using a headless browser and display the detected technologies.

### Options

| Option | Description |
|--------|-------------|
| `-r, --remote` | Run analysis remotely via unbuilt server (runs locally by default) |
| `-s, --save` | Saves the analysis results to the database, which serves as a cache for future runs. By default, CLI analyses are executed without caching results. Available only for admins (you need to set UNBUILT_API_KEY env variable when running). |
| `-n, --async` | Enable asynchronous execution - returns a job ID immediately instead of waiting for the result. This ID can be used to check status or retrieve results later with the `unbuilt status` command. Only available when using `--remote`. |
| `-r, --refresh` | Force a fresh analysis by bypassing the cache. Ignores any previously saved results and rebuilds the cache with new data. |
| `-t, --timeout <seconds>` | Max time to wait for analysis to complete (default: 120) |
| `-j, --json` | Output results in JSON format |

### Examples

```bash
# Run a local analysis
unbuilt https://example.com

# Run a remote analysis
unbuilt https://example.com --remote

# Run a local analysis and save the results to DB (cache).
unbuilt https://example.com --save

# Run a local analysis with longer timeout
unbuilt https://example.com --timeout 30000

# Get JSON output
unbuilt https://example.com --json

# Run a remote analysis asynchronously. Will return <analysisId>.
unbuilt https://example.com --remote --async

# Use <analysisId> to get results.
unbuilt status <analysisId>
```

## Analyzing Multiple Websites (Batch Mode)

The batch command allows you to analyze multiple websites from a CSV file.

### CSV File Format

Create a CSV file with a list of URLs to analyze. The file should have a column header named `url` (or the first column will be used if there's no header).

Example `websites.csv`:
```
url
https://example.com
https://example.org
https://example.net
```

### Basic Usage

```bash
unbuilt batch websites.csv
```

### Options

| Option | Description |
|--------|-------------|
| `-j, --json` | Output results in JSON format |
| `-s, --save` | Save the analysis results to the database |
| `-o, --output <file>` | Save results to a specified output file |
| `-t, --timeout <seconds>` | Max time to wait for each analysis (default: 120) |
| `-c, --concurrent <number>` | Maximum number of concurrent analyses (default: 1) |

### Examples

```bash
# Analyze all websites in the CSV file
unbuilt batch websites.csv

# Analyze multiple websites concurrently (4 at a time)
unbuilt batch websites.csv --concurrent 4

# Save the results to a CSV file
unbuilt batch websites.csv --output results

# Save the results to a JSON file
unbuilt batch websites.csv --output results.json --json

# Analyze websites and save to database
unbuilt batch websites.csv --save

# Set a longer timeout for each analysis
unbuilt batch websites.csv --timeout 300
```

## Checking Analysis Status

When using remote analysis in async mode, you can check the status of an ongoing analysis using the `status` command.

### Basic Usage

```bash
unbuilt status <analysisId>
```

### Options

| Option | Description |
|--------|-------------|
| `-j, --json` | Output results in JSON format |

### Example

```bash
unbuilt status abc123-def456-ghi789
```

## Output Format

By default, Unbuilt displays the analysis results in a human-readable format, showing the detected technologies grouped by category.

When using the `--json` flag, the output will be in JSON format, which is useful for programmatic processing or integration with other tools.

## Performance Considerations

- Local analysis is faster for analyzing a single website.
- Remote analysis is more resource-efficient for your local machine.
- Batch analysis with multiple concurrent processes is the fastest way to analyze many websites.
- Increasing the `--concurrent` parameter will speed up batch analysis, but requires more system resources.

## Using with Database Storage

When using the `--save` option, analysis results are stored in a database for future reference. This allows for:

- Faster retrieval of previously analyzed websites
- Building historical data about technology usage
- Sharing analysis results with team members

Available only for admins (you need to set `UNBUILT_API_KEY` env variable when running. Contact aqson@me.com in order to get access).

## Examples of Common Workflows

### Quick Technology Check

```bash
unbuilt analyze https://example.com
```

### In-depth Analysis with JSON Output for Further Processing

```bash
unbuilt analyze https://example.com --json > analysis.json
```

### Batch Analysis of Many Sites with Results Saved to CSV

```bash
unbuilt batch websites.csv --concurrent 4 --output tech-analysis
```

### Batch Analysis with Database Storage

```bash
UNBUILT_API_KEY="hash" unbuilt batch websites.csv --concurrent 4 --save
```

## Troubleshooting

If you encounter issues with the tool, try the following:

- Ensure you have a stable internet connection
- For batch analysis, start with a smaller number of concurrent processes
- Check that the URL format in your CSV file is correct (should include http:// or https://)
- For local (default) mode, ensure Playwright is properly installed (`npx playwright install chromium`)
- For websites with complex security measures, try using remote analysis mode instead
- No sessions supported. Think of each navigation as Incognito mode.
- In case of loading resources error, check redirects following the resource and try final URL.