---
name: unbuilt
description: Detect the full technology stack of any website by URL. Returns framework, UI library, bundler, state management, styling, tables, animations, forms, API patterns, monitoring, analytics, and more. Use when a user asks to analyze a website's tech stack, build something similar to an existing app, or understand what technologies a site uses.
license: MIT
metadata:
  author: yavorsky
  version: "1.0"
---

# unbuilt-analyze

Detect the complete technology stack of any website using live code analysis.

## When to use

- User asks "what tech stack does [website] use?"
- User says "build me something like [website]" — analyze it first to know what tools to use
- User wants to compare tech stacks of different sites
- User needs to understand a competitor's technical choices

## Prerequisites

The CLI requires Node.js >= 20 and Playwright (installs Chromium automatically).

```bash
npm install -g @unbuilt/cli
```

If `unbuilt` is not installed, install it first before running analysis.

## Usage

### Basic analysis (local Playwright)

```bash
unbuilt <url>
```

### Agent-friendly compact output (recommended for LLM context)

```bash
unbuilt <url> --format agent
```

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
Analytics: PostHog
```

### JSON output (for structured processing)

```bash
unbuilt <url> --json
```

### Remote analysis (via unbuilt.app servers)

```bash
unbuilt <url> --remote
```

Use `--remote` when local Playwright is unavailable or for faster cached results.

### Batch analysis

```bash
unbuilt batch urls.csv --output results.json --concurrent 3
```

CSV format: one URL per line, or with headers.

## Detection categories

| Category | Examples |
|----------|---------|
| Framework | Next.js, Nuxt, Remix, Astro, SvelteKit, Gatsby |
| UI Library | React, Vue, Angular, Svelte, Solid |
| Bundler | Webpack, Vite, Rollup, Parcel, esbuild |
| Styling | Tailwind, PostCSS, Sass, Less, CSS Modules |
| Component Library | Radix UI, Headless UI, Ant Design, daisyUI |
| State Management | Redux, Zustand, MobX, Jotai, TanStack Query |
| Tables/Virtualization | TanStack Table, AG Grid, React Window, Virtuoso |
| Forms | React Hook Form, Formik, Zod, Yup |
| Animation | Framer Motion, GSAP, Lottie, anime.js |
| API Patterns | GraphQL (Apollo/urql/Relay), tRPC, WebSocket, SSE |
| HTTP Client | Axios, Fetch, SuperAgent |
| Router | React Router, Vue Router, Next.js Router |
| Translations | i18next, react-intl |
| Dates | date-fns, Moment.js, Luxon, Day.js |
| Transpiler | Babel, SWC, TypeScript |
| Monitoring | Sentry, Datadog, Rollbar |
| Analytics | Google Analytics, PostHog, Mixpanel |
| Platform | Vercel, Netlify, Cloudflare, Shopify |

## Tips

- Use `--format agent` for the most context-efficient output when building something similar
- Remote analysis is faster for previously analyzed sites (results are cached)
- Local analysis can detect more technologies (has full browser access)
- Use `--session` flag to analyze sites behind authentication using your local Chrome session
- Combine with the site's AGENTS.md or README for the most complete picture
