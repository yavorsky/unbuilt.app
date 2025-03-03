# Contributing to unbuilt.app

Thank you for your interest in contributing to unbuilt.app! Together, we can unbuild the web and make technology stacks more transparent. This document provides guidelines and information to help you contribute effectively.

## Table of Contents
- [Creating an Issue (RFC)](#creating-an-issue-rfc)
- [Pull Request Process](#pull-request-process)
- [Repository Structure](#repository-structure)
- [Feature Pattern API](#feature-pattern-api)
- [Testing Your Contributions](#testing-your-contributions)
- [Code Style Guidelines](#code-style-guidelines)

## Creating an Issue (RFC)

Before submitting a PR, we strongly recommend creating an issue (RFC) first. This helps:

- Prevent multiple people working on the same feature
- Align implementation with project goals
- Get early feedback on your approach
- Save time by validating ideas before coding

Even a simple RFC with a few lines of code or a concept description is valuable. This approach ensures your contribution has the best chance of being accepted and fits well with the project's direction.

## Pull Request Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Implement your changes
4. Add tests to ensure reliability
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Repository Structure

The project is organized as a monorepo using Turborepo with the following structure:

```
unbuild.app/
├── apps/
│   └── web/           # Next.js application + unbuilding service
│                      # Contains the web app and queue-based service
│
├── packages/
│   ├── analyzer/      # Core analysis engine
│   │                  # Accepts URL and browser instances, tracks loaded resources
│   │                  # Analyzes web resources using feature patterns
│   │
│   ├── features/      # Technology detection patterns
│   │                  # Grouped by categories (bundler, router, state-management, etc.)
│   │
│   ├── helpers/       # Browser and CLI interaction utilities
│   │                  # Reusable helpers for browser interactions
│   │
│   ├── resources/     # Resource collection entities
│   │                  # Entities for collecting JS, CSS, documents from URLs
│   │
│   └── testing/       # Testing utilities
│                      # Tools to verify patterns detect correctly without false positives
```

## Feature Pattern API

The Feature Pattern API is the core of unbuilt.app's detection capabilities. This section explains how to create effective patterns for detecting web technologies.

### Pattern Structure

Each feature target is defined as an array with groups of patterns. The system evaluates all pattern groups, accumulates scores, and identifies the highest-scoring technology in each category.

```typescript
// Example of a feature detection pattern
export const next = [
  {
    name: 'core' as const,
    score: 1.0,
    scripts: [
      // Core Next.js-specific globals and identifiers
      /window\.__NEXT_P\s*=/, // Next.js page loader
      /__NEXT_CROSS_ORIGIN/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.3,
    stylesheets: [
      // Generated Tailwind classes using color opacity syntax
      /\.(?:bg|text|border)-(?:[\w-]+)(?:-\d+)?\/\d+/,
    ],
  },
  // Additional pattern groups...
];
```

### Core Pattern Properties

Each pattern group must include these required properties:

- **name**: String identifier for the pattern group (e.g., 'core', 'ssr', 'routing'). Helps with debugging and display in the UI.
- **score**: Numeric value (typically between 0.1 and 2.0) indicating confidence level. Score is added to the total when any pattern in the group matches.

### Detection Methods

Pattern groups can use one or more of these detection methods:

#### 1. Scripts Patterns

RegExp patterns that run against JavaScript files loaded by the page:

```typescript
{
  name: 'core',
  score: 1.0,
  scripts: [
    /window\.__NEXT_P\s*=/, // Next.js page loader
    /__NEXT_CROSS_ORIGIN/,
  ],
}
```

#### 2. Stylesheets Patterns

RegExp patterns that run against CSS stylesheets:

```typescript
{
  name: 'styles',
  score: 0.2,
  stylesheets: [
    // Lucide-specific CSS class patterns
    /\.lucide(?:-icon)?(?:\[[^\]]+\]|\.[a-zA-Z0-9-]+)?\s*\{[^}]*\}/,
    // Lucide animation classes
    /\.lucide-(?:spin|pulse|rotate-\d+)/,
  ],
}
```

#### 3. Documents Patterns

RegExp patterns that run against HTML documents:

```typescript
{
  name: 'web-components',
  score: 0.5,
  documents: [
    /* Matches custom element tags
    <my-element>
    <user-card data-id="123">
    <fancy-button class="primary"> */
    /<[a-z]+-[a-z-]*[^>]*>/i,
  ],
}
```

#### 4. Browser Function

JavaScript function that executes after all resources are loaded:

```typescript
{
  score: 2,
  name: 'ssr',
  browser: async (page: Page) => {
    return page.evaluate(() => {
      const markers = {
        // Next.js data object
        hasNextData: !!window.__NEXT_DATA__,
        // Next.js specific props
        hasPageProps: document.querySelector('[data-nextjs-page]') !== null,
        // Additional checks...
      };
      return Object.values(markers).some(Boolean);
    });
  },
}
```

The browser function receives a Playwright `Page` object, allowing runtime detection through page evaluation. Score is added only if the function returns true.

### Combining Detection Methods

You can combine multiple detection methods in a single pattern group:

```typescript
{
  name: 'comprehensive',
  score: 2.0,
  scripts: [/specificPattern/],
  stylesheets: [/stylingPattern/],
  browser: async (page) => {
    // Runtime detection
    return page.evaluate(() => Boolean(window.specificFeature));
  }
}
```

### Best Practices

1. **Use descriptive names** for pattern groups to aid in debugging and understanding
2. **Set appropriate confidence scores**:
   - Lower scores (0.1-0.3) for common patterns that might appear in multiple technologies
   - Higher scores (0.5-2.0) for definitive, unique signatures
3. **Combine pattern types** for more accurate detection
4. **Use comments** to explain non-obvious patterns
5. **Test thoroughly** to avoid false positives and negatives

### Testing Patterns

See testing section: [Testing](./testing/e2e/README.md).

## Adding Detection Patterns

There are two ways to contribute detection patterns to unbuilt.app:

### 1. Adding Patterns for Existing Features

If you want to add detection patterns for technologies that fall under existing categories:

1. Navigate to the `packages/features` directory
2. Find the relevant feature category (e.g., bundler, framework, uiLibrary)
3. Follow the pattern structure used in existing files
4. Add your new detection pattern
5. Update confidence values in related tests if relevant
6. Test your pattern using the testing utilities to ensure accuracy

Example:
```typescript
// Adding a pattern for a new UI library
export const myNewUiLibrary = {
  name: "MyNewUI",
  pattern: /myNewUI\.(?:min\.)?js/i,
  confidence: 0.8,
};
```

### 2. Adding Patterns for New Feature Categories

If you want to add an entirely new feature category:

1. Create a new directory in `packages/features` for your category
2. Implement the detection patterns following the established structure
3. Create appropriate tests in the `testing` package
4. **Important**: Mention in your PR description that this requires a Supabase structure update, so it will be part of the Definition of Done (DoD) for the PR review by unbuilt.app maintainers

Example of adding a new category:
```typescript
// New category for performance monitoring tools
export const performanceMonitoring = {
  detect: [
    {
      name: "New Relic",
      pattern: /newrelic\.(?:min\.)?js/i,
      confidence: 0.9,
    },
    {
      name: "Datadog",
      pattern: /datadog-rum\.(?:min\.)?js/i,
      confidence: 0.85,
    }
  ]
};
```

In both cases, ensure your patterns are specific enough to avoid false positives but broad enough to catch different versions and implementations.

## Testing Your Contributions

The `testing` package contains tools to verify your contributions:

- **Detection Verification**: Ensures new patterns correctly detect technologies
- **False Positive Prevention**: Confirms patterns don't incorrectly identify technologies
- **Format Validation**: Validates pattern format consistency
- **Integration Testing**: Ensures changes don't break existing functionality

We strongly recommend running the test suite before submitting your PR:

```bash
# Run all tests
npm run test

# Test a specific pattern
npm run test:pattern -- --pattern=react
```

## Code Style Guidelines

- Follow the existing code style in the repository
- Use TypeScript for type safety
- Write meaningful commit messages
- Document your code, especially for complex logic
- Add comments explaining "why" rather than "what"

## Questions?

If you have any questions or need clarification, feel free to ask in the issue you've created or reach out through our community channels.

Thank you for contributing to unbuild.app!