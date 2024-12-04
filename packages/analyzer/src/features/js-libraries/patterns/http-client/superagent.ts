import { Page } from 'playwright';

export const superagent = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core imports and instances
      /["']superagent["']/,
      /superagent\./,
      /request\./,

      // Distinctive method chains
      /\.(?:get|post|put|patch|delete)\s*\([^)]*\)\s*\.(?:set|send|query|end|field|attach)/,
      /\.set\s*\([^)]*\)\s*\.(?:set|send|query|end)/,
      /\.query\s*\([^)]*\)\s*\.(?:set|send|end)/,
      /\.send\s*\([^)]*\)\s*\.(?:set|query|end)/,

      // Content type setting
      /\.type\s*\(['"](?:json|form|application|multipart)["']\)/,
      /\.accept\s*\(['"](?:\*|application|text)\/[\w+\-.]+["']\)/,

      // Response handling
      /\.end\s*\(\s*function\s*\([^)]*\)\s*{/,
      /\.then\s*\(\s*(?:function)?\s*\([^)]*\)\s*{/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for global superagent
          hasGlobal: !!window.superagent,

          // Check for request function
          hasRequest:
            typeof window.request === 'function' &&
            'get' in window.request &&
            'post' in window.request,

          // Check for prototype methods
          hasProto: !!(
            window.request?.Request?.prototype?.send ||
            window.request?.Request?.prototype?.end
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // Utility methods
      /\.timeout\s*\(\d+\)/,
      /\.retry\s*\(\d+\)/,
      /\.abort\s*\(\)/,
      /\.pipe\s*\(/,

      // Form data and attachments
      /\.field\s*\(['"][^'"]+["']\s*,/,
      /\.attach\s*\(['"][^'"]+["']\s*,/,
      /\.attach\s*\([^)]+FormData\)/,

      // Error handling patterns
      /if\s*\(\s*err\.timeout\s*\)/,
      /if\s*\(\s*err\.status\s*===?\s*\d+\s*\)/,
      /\.ok\s*\(\s*function\s*\([^)]*\)\s*{/,

      // Serialization/Parsing
      /\.serialize\s*\(/,
      /\.parse\s*\(/,
      /\.buffer\s*\(/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Library files
      /superagent(?:\.min)?\.js$/i,
      /superagent-\w+\.js$/i,
      /node_modules\/superagent\//i,

      // Common integration patterns
      /api(?:-)?client\.js$/i,
      /http(?:-)?client\.js$/i,
      /request(?:-)?client\.js$/i,
      /superagent(?:-)?instance\.js$/i,

      // Build output patterns
      /\brequest\.[a-f0-9]+\.js$/i,
      /\bapi\.[a-f0-9]+\.js$/i,
      /\bhttp\.[a-f0-9]+\.js$/i,

      // Plugin patterns
      /superagent-prefix/i,
      /superagent-retry/i,
      /superagent-promise/i,
    ],
  },
];
