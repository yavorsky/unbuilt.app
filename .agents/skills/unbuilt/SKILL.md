---
name: unbuilt
description: Detect the full technology stack of any website by URL. Returns framework, UI library, bundler, state management, styling, tables, animations, forms, API patterns, monitoring, analytics, and more. Use when a user asks to analyze a website's tech stack, build something similar to an existing app, or understand what technologies a site uses.
license: MIT
metadata:
  author: yavorsky
  version: "1.0"
---

# unbuilt

Detect the complete technology stack of any website using live code analysis.

## When to use

- User asks "what tech stack does [website] use?"
- User says "build me something like [website]" — analyze it first
- User wants to compare tech stacks of different sites
- User needs to understand a competitor's technical choices

## Prerequisites

Requires Node.js >= 20. Install if not present:

```bash
npm install -g @unbuilt/cli
```

## Analyze a website

```bash
unbuilt <url> --format agent
```

Always use `--format agent` — it returns compact one-line-per-category output optimized for your context window.

Example output:
```
Framework: Next.js
UI: React
Bundler: Webpack
Styling: Tailwind CSS + PostCSS
State: Zustand
Tables: TanStack Table + TanStack Virtual
Components: Radix UI
Animation: Framer Motion
Router: Next.js Router
Monitoring: Sentry
```

## Alternative output formats

Only use these if the user explicitly asks for more detail:

- `--json` — full structured JSON with confidence scores and matched patterns
- No flag — default table output with all categories

## Remote analysis

If Playwright fails or takes too long:

```bash
unbuilt <url> --remote --format agent
```

Uses unbuilt.app servers with cached results.

## Detection categories

Framework, UI Library, Bundler, Styling, Component Library (Radix, Headless UI, Ant Design), State Management, Tables/Virtualization (TanStack Table, AG Grid, Virtuoso), Forms (React Hook Form, Formik, Zod), Animation (Framer Motion, GSAP, Lottie), API Patterns (GraphQL, tRPC, WebSocket, SSE), HTTP Client, Router, Translations, Dates, Transpiler, Monitoring, Analytics, Platform.
