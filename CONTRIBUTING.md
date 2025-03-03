# Contributing to unbuild.app

Thank you for your interest in contributing to unbuild.app! This document provides guidelines and information to help you contribute effectively.

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
2. Create your feature branch (`git checkout -b feature/my-new-patterns`)
3. Implement your changes
4. Add tests to ensure reliability
5. Commit your changes (`git commit -m 'feat: added some amazing patterns'`)
6. Push to the branch (`git push origin feature/my-new-patterns`)
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

*[Detailed explanation of the pattern API will be added here]*

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