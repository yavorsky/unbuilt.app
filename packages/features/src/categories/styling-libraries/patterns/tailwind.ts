import { Page } from 'playwright';

export const tailwind = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Core utility patterns (minification-resistant)
      /(?:^|\s)(?:[mp][trblxy]?-|[wh]-|gap-|space-[xy]-)\d+/,
      /(?:^|\s)(?:flex|grid|block|inline|hidden)/,
      /(?:^|\s)(?:bg|text|border|ring)-(?:[a-z]+|\[#[^\]]+\])/,
      /(?:^|\s)(?:rounded|shadow|opacity|scale|rotate|translate|skew)-/,
      /(?:^|\s)(?:hover|focus|active|disabled|group|dark):/,

      // Responsive prefixes
      /(?:^|\s)(?:sm|md|lg|xl|2xl):/,

      // JIT mode markers (survives minification)
      /tailwindcss\/jit/,
      /tailwind\/jit/,

      // Arbitrary values (common in production)
      /\[[\w\s\-%,.#()]+\]/,

      // Common combined patterns
      /(?:^|\s)(?:flex|grid)(?:-(?:row|col|wrap))?/,
      /(?:^|\s)(?:justify|items|content)-(?:start|end|center|between)/,

      // Color patterns that survive minification
      /(?:^|\s)(?:bg|text|border|ring)-(?:primary|secondary|white|black|gray|red|blue|green)/,

      // Special characters that indicate Tailwind
      /\//, // divide classes
      /:/, // modifier separator
      /-/, // general separator
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Common Tailwind patterns in a minification-resistant way
        const patterns = [
          // Layout patterns
          /^(?:flex|grid|block|inline|hidden)$/,
          // Spacing patterns
          /^(?:[mp][trblxy]?-\d+)$/,
          // Color patterns
          /^(?:bg|text|border)-(?:[a-z]+|\[#[^\]]+\])$/,
          // Responsive patterns
          /^(?:sm|md|lg|xl|2xl):/,
          // Arbitrary values
          /\[.+\]/,
        ];

        // Check a sample of elements (for performance)
        const elements = Array.from(document.querySelectorAll('*')).slice(
          0,
          100
        );

        return (
          elements.some((el) =>
            Array.from(el.classList).some((className) =>
              patterns.some((pattern) => pattern.test(className))
            )
          ) || !!document.querySelector('[class*="tailwind"]')
        );
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Core files
      /tailwind/,
      /\.tailwind\.css$/,
      /tailwind\.[\w-]+\.css$/,
      /tw\.[\w-]+\.css$/,

      // Common build output patterns
      /styles\.[a-f0-9]+\.css$/, // Need to check content for Tailwind patterns
      /main\.[a-f0-9]+\.css$/,
      /app\.[a-f0-9]+\.css$/,
    ],
  },
];
