import { Page } from 'playwright';

export const shadcn = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Core shadcn/ui class patterns (using Tailwind)
      /(?:^|\s)(?:hover|focus|active|disabled|group|data|aria|state)-/,

      // Common shadcn component classes
      /\b(?:relative|absolute|flex|inline-flex|grid|hidden)\b/,

      // shadcn specific class combinations
      /items-center/,
      /justify-center/,
      /gap-[0-9]/,

      // Radix UI primitives (used by shadcn)
      /radix-(?:state|side|placeholder|popper)/,
      /data-\[(?:state|side|placeholder|popper)/,

      // Common component class patterns
      /(?:^|\s)(?:scroll-area|select-none|inline-flex|button|dropdown|dialog|toast|tabs)/,

      // Lucide icons (commonly used with shadcn)
      /lucide-react/,
      /lucide-icon/,

      // Component-specific classes
      /data-\[state=(?:open|closed)\]/,
      /data-\[side=(?:top|bottom|left|right)\]/,
      /data-\[orientation=(?:horizontal|vertical)\]/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Radix primitives usage
          hasRadixAttributes:
            !!document.querySelector('[data-radix-popper-content-wrapper]') ||
            !!document.querySelector('[role="dialog"][data-state]'),

          // Check for common shadcn class patterns
          hasShadcnClasses:
            document.querySelector(
              '[class*="scroll-area"], [class*="select-none"]'
            ) !== null,

          // Check for Radix state attributes
          hasStateAttributes:
            document.querySelector(
              '[data-state="open"], [data-state="closed"]'
            ) !== null,

          // Check for common component structures
          hasComponents: !!(
            document.querySelector('[role="dialog"]') ||
            document.querySelector('[role="combobox"]') ||
            document.querySelector('[role="tooltip"]')
          ),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'files' as const,
    score: 0.2,
    filenames: [
      // Component files
      /components\/ui\//,
      /shadcn\/ui/,

      // Common file patterns
      /\.shadcn\.ts$/,
      /components\.style\.ts$/,

      // Build output
      /shadcn-ui\.[a-f0-9]+\.js$/,
      /ui-components\.[a-f0-9]+\.js$/,
    ],
  },
];
