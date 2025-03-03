# Testing Guide for unbuilt.app

This document explains how to test detection patterns for unbuilt.app, ensuring they accurately identify technologies without false positives.

## Overview

The `testing` package contains tools to verify your contributions:

- **Detection Verification**: Ensures patterns correctly detect technologies
- **False Positive Prevention**: Confirms patterns don't incorrectly identify technologies
- **Format Validation**: Validates pattern format consistency
- **Integration Testing**: Ensures changes don't break existing functionality

## Running Tests

We strongly recommend running the test suite before submitting your PR:

```bash
# Run all tests
npm run test

# Runs tests related to react ui library, mui stling library, and vite as bundler
npm run test react mui vite
```

## Virtual Testing

For thorough testing, we use the `analyzeVirtualApp` utility that creates virtual applications with specific configurations to verify detection patterns.

### Virtual Test Structure

Here's an example of a virtual test:

```typescript
import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects technology-name', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: 'build-directory',
      buildCommand: 'build-command',
      startCommand: 'start-command', // Optional
      env: {
        // Optional environment variables
        ENV_VAR: 'value',
      },
      dependencies: {
        // Required dependencies with versions
        'library-name': 'version',
        'another-library': '^2.0.0',
      },
      files: {
        // Files needed to create a minimal reproducible example
        'config-file.js': `
          // Configuration content
          module.exports = {
            // Settings
          }
        `,
        'src/components/Component.jsx': `
          // Component implementation
          import { Something } from 'library-name';

          export default function Component() {
            return <Something />;
          }
        `,
        // Additional files as needed
      },
    },
    { preserveFiles: true } // Optional settings
  );

  it('detects specific feature', async () => {
    expect(result.category.name).toBe('expected-name');
    expect(result.category.confidence).toBeGreaterThanOrEqual(threshold);
    // Additional assertions as needed
  });
});
```

### Key Components

1. **Configuration Object**:
   - `outDir`: Where build files are output
   - `buildCommand`: Command to build the application
   - `startCommand`: (Optional) Command to start the application
   - `env`: (Optional) Environment variables
   - `dependencies`: Required npm packages and versions
   - `files`: Content of files needed for detection

2. **Test Assertions**:
   - Verify the correct technology is detected
   - Check confidence scores meet the threshold
   - Test for secondary matches if applicable

### Example: Testing Next.js with Material UI and PostCSS

```typescript
import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects next.js with react, mui and postcss', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: '.next',
      buildCommand: 'next build',
      dependencies: {
        next: '15.1.7',
        react: '19.0.0',
        'react-dom': '19.0.0',
        '@mui/material': '^5.15.3',
        '@emotion/react': '^11.11.3',
        postcss: '^8.4.32',
        // Other dependencies as needed
      },
      files: {
        'postcss.config.js': `
          module.exports = {
            plugins: [
              'postcss-import',
              'postcss-flexbugs-fixes',
              // Other plugins
            ],
          }
        `,
        // Other necessary files
      },
    },
    { preserveFiles: true }
  );

  it('detects next.js framework', async () => {
    expect(result.framework.name).toBe('next');
    expect(result.framework.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects mui component library', async () => {
    expect(result.stylingLibraries.items.mui).toBeTruthy();
    expect(result.stylingLibraries.items.mui.confidence).toBeGreaterThanOrEqual(0.9);
  });

  // Additional assertions
});
```

## Best Practices

When creating virtual tests:

1. **Optimze amount of tests** - Try to find relevant testing group and add tests for new features there. (for examle in case you want to test new Monitoring library, just update some test without any monitoring library.) It will save some time for project e2e testing
2. **Include minimal dependencies** - Only add what's necessary to detect the technology
3. **Create minimal file content** - Focus on patterns that will trigger detection
4. **Test specifically what you're adding** - Write assertions for the patterns you've implemented
5. **Consider edge cases** - Test different versions or configurations if relevant
6. **Make tests deterministic** - Ensure tests produce consistent results

## Testing with Real Websites

For some technologies, especially platforms and widely-used frameworks, testing with real-world websites may be more practical:

1. Identify 2-3 websites known to use the technology
2. Document how to verify the technology is present (e.g., specific variables in DevTools)
3. Run the unbuilt.app analyzer against these sites to validate detection

## Questions?

If you have questions about testing your patterns, please ask in your RFC issue or reach out [Artem Yavorsky](https://x.com/yavorsky_).