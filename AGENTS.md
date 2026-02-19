# AGENTS.md — unbuilt.app

> Tech stack detection for websites via Playwright + pattern matching.

## Project Structure

Monorepo (yarn workspaces + turborepo):

```
apps/cli/          — CLI tool (`unbuilt <url>`)
apps/web/          — Next.js web app (unbuilt.app)
packages/analyzer/ — Orchestrates detection: navigates page, runs all detectors, two-pass analysis
packages/features/ — Detection categories & patterns (this is where you add new detections)
packages/helpers/  — Shared utilities
packages/resources/— Resource tracking (scripts, stylesheets, etc.)
```

## How Detection Works

1. **Resources** are collected from a live page (scripts, stylesheets, documents, headers, filenames)
2. **Patterns** match against those resources using regex and browser checks
3. **Two-pass analysis**: first pass detects everything independently, second pass runs `dependencies` checks so categories can reference each other's results
4. Each category returns: `{ name, confidence, detectedFeatures, secondaryMatches }`

### Pattern Interface

```typescript
interface Pattern {
  score: number;           // Weight (0-1). Higher = stronger signal
  name: string;            // Identifier for this pattern
  scripts?: RegExp[];      // Match against JS bundle contents
  stylesheets?: RegExp[];  // Match against CSS contents
  documents?: RegExp[];    // Match against HTML document
  headers?: Record<string, RegExp>; // Match against HTTP headers
  filenames?: RegExp[];    // Match against resource URLs
  browser?: (page, browser) => boolean | Promise<boolean>; // Runtime check
  dependencies?: (analysis) => boolean; // Cross-category dependency check (2nd pass)
}
```

### Key Types

- `Pattern` — `packages/features/src/types/pattern.ts`
- `FeatureResult` — `packages/features/src/types/feature.ts`
- `CalculationResult` — `packages/features/src/types/feature.ts`
- `AnalysisFeatures` — `packages/features/src/types/analysis.ts`
- `AnalyzeResult` — `packages/analyzer/src/types.ts`

## Adding a Pattern to an Existing Category

Example: adding a new state management library.

1. Create `packages/features/src/categories/state-management/patterns/my-lib.ts`:
```typescript
export const myLib = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/my-lib-unique-marker/],
    filenames: [/my-lib/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/useMyLib\s*\(/],
  },
];
```

2. Add to `patterns/index.ts`:
```typescript
import { myLib } from './my-lib.js';
export const patterns = { ...existing, myLib } as const;
```

3. Add to `meta/index.ts` with a `Meta` object:
```typescript
import { Meta } from '../../../types/meta.js';
// Add to meta object: myLib: { name: 'My Lib', website: '...', description: '...', Icon: null } satisfies Meta
```

## Adding a New Detection Category

1. Create `packages/features/src/categories/my-category/` with:
   - `patterns/` — individual pattern files + `index.ts`
   - `meta/index.ts` — Meta objects for each pattern
   - `detect.ts` — calls `detectFeature()` with type key
   - `index.ts` — re-exports detect, meta, patterns

2. Register in:
   - `packages/features/src/categories/index.ts` — `export * as myCategory from './my-category/index.js'`
   - `packages/features/src/index.ts` — export category + meta
   - `packages/features/src/types/analysis.ts` — add to `AnalysisFeatures`
   - `packages/analyzer/src/utils/analyze-feature.ts` — import + add to `detectionMap`

3. Update web app types (if applicable):
   - `apps/web/src/app/utils/get-category-label.ts`
   - `apps/web/src/app/utils/get-technology-meta.ts`
   - `apps/web/src/server/utils/column-mapping.ts`
   - `apps/web/src/server/utils/extract-secondary-matches.ts`
   - `apps/web/src/server/utils/format-analyzis-response.ts`

## CLI Usage

```bash
# Basic analysis
yarn cli <url>

# JSON output
yarn cli <url> --json

# Agent-optimized compact output (for LLM context)
yarn cli <url> --format agent

# With local Chrome session for better accuracy
yarn cli <url> --session
```

## Build & Test

```bash
yarn build          # Build all packages
yarn test           # Run tests
yarn lint           # Lint + fix
```

## Categories

bundler, framework, uiLibrary, stateManagement, httpClient, router, translations, dates, stylingLibraries, stylingProcessor, transpiler, minifier, modules, monitoring, analytics, platform, tableLibrary, componentLibrary, animation, formLibrary, apiPattern
