import { Page } from 'playwright';

export const superagent = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    scripts: [
      // Superagent-specific imports
      /import\s+(?:\* as\s+)?(?:superagent|request)\s+from\s+['"]superagent['"]/,
      /require\s*\(\s*['"]superagent['"]\s*\)/,

      // Superagent-specific chaining patterns
      /superagent(?:\.get|\.post|\.put|\.patch|\.delete)\s*\([^)]*\)(?:\.set|\.send|\.query|\.field|\.attach|\.type)\s*\(/,
      /request(?:\.get|\.post|\.put|\.patch|\.delete)\s*\([^)]*\)(?:\.set|\.send|\.query|\.field|\.attach|\.type)\s*\(/,

      // Superagent-specific type setting
      /\.type\s*\(['"](?:form(?:-data)?|json|multipart\/form-data)['"]\)/,

      // Superagent-specific response handling
      /\.end\s*\(\s*(?:function\s*)?\(\s*err\s*,\s*res\s*\)\s*=>/,
      /\.ok\s*\(\s*(?:function\s*)?\(\s*res\s*\)\s*=>\s*res\.status\s*<\s*\d+\s*\)/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- No need to type-check got object
        const isSuperagentRequest = (obj: any) => {
          return (
            obj &&
            typeof obj === 'function' &&
            'get' in obj &&
            'post' in obj &&
            obj.Request &&
            obj.Request.prototype &&
            'end' in obj.Request.prototype &&
            'send' in obj.Request.prototype
          );
        };

        return !!(
          (window.superagent && isSuperagentRequest(window.superagent)) ||
          (window.request && isSuperagentRequest(window.request))
        );
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.3,
    scripts: [
      // Superagent-specific form data handling
      /\.field\s*\(['"][^'"]+['"],\s*[^)]+\)\.field\s*\(/, // Multiple field chaining
      /\.attach\s*\(['"][^'"]+['"],\s*(?:new FormData\(\)|[^)]+,\s*['"][^'"]+['"])\)/,

      // Superagent-specific error handling
      /if\s*\(\s*err\.timeout\s*&&\s*err\.code\s*===\s*['"]ECONNABORTED['"]\s*\)/,
      /if\s*\(\s*err\s*&&\s*err\.response\s*&&\s*err\.response\.status\s*===?\s*\d+\s*\)/,

      // Superagent-specific plugins and utilities
      /use\s*\(\s*(?:prefix|retry|promise|proxy|auth)\s*\([^)]*\)\s*\)/,

      // Superagent-specific configuration
      /\.timeout\s*\(\s*\{\s*(?:response|deadline):\s*\d+\s*\}\)/,
      /\.retry\s*\(\s*\d+\s*,\s*\{\s*(?:retries|delay):/,

      // Superagent-specific serialization
      /\.serialize\s*\(\s*\{\s*(?:application|json|xml):/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Superagent-specific library files
      /(?:^|\/)superagent(?:\.min)?\.js$/i,

      // Superagent-specific plugins
      /superagent-(?:prefix|retry|promise|proxy)(?:\.min)?\.js$/i,

      // Superagent-specific configuration files
      /superagent-config\.js$/i,
      /superagent-setup\.js$/i,

      // Build output specific to Superagent
      /\bsuperagent\.[a-f0-9]{8}\.js$/i, // Build hash pattern
    ],
  },
];
