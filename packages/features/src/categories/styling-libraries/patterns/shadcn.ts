import { Page } from 'playwright';

export const shadcn = [
  {
    name: 'compilation' as const,
    score: 0.7,
    scripts: [
      // Display name assignment pattern
      /\w+\.displayName\s*=\s*["'](Button|Dialog|DropdownMenu)["'];\s*(?:.*\s*)*\w+\s*=\s*\w+\.forwardRef/,

      // Classname assigntment
      /className:\s*\w+\(\s*\w+\(\{\s*variant:\s*\w+,\s*size:\s*\w+,\s*className:\s*\w+\s*\}\)\)/,

      // shadcn/ui's cva function pattern (class-variance-authority)
      /let\s+\w+\s*=\s*\(\s*0\s*,\s*\w+\s*\.\s*F\s*\)\s*\(\s*["'](?:[^"']*whitespace-nowrap[^"']*rounded-md[^"']*ring-offset-background[^"']*)/,

      // shadcn/ui variant definitions structure
      /variants:\s*\{\s*variant:\s*\{\s*default:[^}]*text-primary-foreground[^}]*,\s*destructive:[^}]*text-destructive-foreground[^}]*,\s*outline:[^}]*border-input\s*bg-background[^}]*,\s*secondary:[^}]*bg-secondary\s*text-secondary-foreground[^}]*,\s*ghost:[^}]*hover:bg-accent[^}]*,\s*link:[^}]*text-primary\s*underline-offset-4[^}]*\s*\}/,

      // shadcn/ui specific data attributes
      /data-\[state=open\]:animate-in\s+data-\[state=closed\]:animate-out\s+data-\[state=closed\]:fade-out-0\s+data-\[state=open\]:fade-in-0\s+data-\[state=closed\]:zoom-out-95\s+data-\[state=open\]:zoom-in-95\s+data-\[state=closed\]:slide-out-to-left-1\/2/,

      /className:\s*["'][^"']*absolute\s+right-4\s+top-4\s+rounded-sm\s+opacity-70\s+ring-offset-background[^"']*["'][^>]*>\s*\([^)]*\.jsx\)\([^)]*\{\s*className:\s*["']h-4\s+w-4["']\s*\}\),\s*\([^)]*\.jsx\)\([^)]*\{\s*className:\s*["']sr-only["'][^}]*\},\s*["']Close["']/,

      // command component
      /\(\s*0\s*,\s*\w+\.jsxs?\s*\)\(\s*\w+\s*,\s*\{\s*(?:[^}]*,)?\s*children:\s*\[\s*\(\s*0\s*,\s*\w+\.jsx\s*\)\(\s*\w+\s*\.\s*\w+\s*,\s*\{\s*className:[^}]*\}\s*\)\s*,\s*\(\s*0\s*,\s*\w+\.jsx\s*\)\(\s*["']input["']\s*,\s*\{\s*(?:[^}]*,)?\s*placeholder:\s*["']Search\.\.\.["']/,

      // shadcn/ui's specific variant patterns
      /class=["'](?:[^"']{0,100}?\s)?(?:destructive|outline|secondary|ghost|link)(?:\s[^"']{0,100})?["']/,

      // shadcn/ui's unique component file structure
      /from\s+["']@\/components\/ui\/(?:accordion|alert-dialog|aspect-ratio|avatar|badge|calendar|card|carousel|checkbox|collapsible|command|context-menu|dialog|dropdown-menu|hover-card|input|label|menubar|navigation-menu|popover|progress|radio-group|scroll-area|select|separator|sheet|skeleton|slider|switch|table|tabs|textarea|toggle|tooltip)["']/,

      // Pattern for shadcn's select component with specific chevron icon
      /\(\s*0\s*,\s*\w+\.jsxs?\s*\)\(\s*\w+\s*\.\s*\w+\s*,\s*\{\s*(?:[^}]*,)?\s*children:\s*\[\s*\(\s*0\s*,\s*\w+\.jsx\s*\)\(\s*\w+\s*\.\s*\w+\s*,\s*\{[^}]*\}\s*\)\s*,\s*\(\s*0\s*,\s*\w+\.jsx\s*\)\(\s*\w+\s*,\s*\{\s*className:[^}]*\}\s*\)\s*\]\s*\}\s*\)/,

      // shadcn/ui's toast component configuration
      /toast:[^{]*\{\s*(?:[^}]*,)?\s*title:\s*["'][^"']*["']\s*,\s*description:\s*["'][^"']*["']\s*,\s*(?:action\s*:\s*\{[^}]*\}\s*,\s*)?(?:variant\s*:\s*["'](?:default|destructive)["']\s*,\s*)?\s*(?:duration\s*:\s*\d+\s*,\s*)?\s*\}/,

      // accordion
      /\(\s*0\s*,\s*\w+\.jsxs?\s*\)\(\s*\w+\s*\.\s*\w+\s*,\s*\{\s*(?:[^}]*,)?\s*children:\s*\[\s*[^,]*,\s*\(\s*0\s*,\s*\w+\.jsx\s*\)\(\s*\w+\s*,\s*\{\s*className:\s*["']h-4\s+w-4\s+(?:shrink|transition)-0[^"']*data-\[state=open\]:rotate-180[^"']*["']/,

      // shadcn/ui specific component configuration
      /cn\(\s*buttonVariants\(\{[^}]*variant:/,
      /cn\(\s*alertVariants\(\{[^}]*variant:/,
      /cn\(\s*cardVariants\(\{[^}]*variant:/,

      // shadcn/ui's specific className patterns with cn utility
      /cn\(\s*["'](?:fixed|absolute)\s+(?:inset-0|inset-x-0|inset-y-0)\s+z-50\s+flex\s+items-center\s+justify-center["']/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for shadcn/ui specific variants
          hasVariants:
            document.querySelector(
              '.destructive[class*="hover:bg-destructive"]'
            ) !== null,

          hasButtonVariants: (() => {
            const buttonClasses = [
              'bg-primary text-primary-foreground',
              'bg-destructive text-destructive-foreground',
              'border border-input bg-background',
              'bg-secondary text-secondary-foreground',
            ];

            for (const cls of buttonClasses) {
              const parts = cls.split(' ');
              if (
                document.querySelector(
                  `button[class*="${parts[0]}"][class*="${parts[1]}"]`
                )
              ) {
                return true;
              }
            }
            return false;
          })(),

          // Check for shadcn/ui theme configuration
          hasThemeConfig:
            document.querySelector('[data-shadcn-theme]') !== null,

          hasDataStateAnimations: (() => {
            return !!document.querySelector(
              '[data-state][class*="data-[state=open]:animate-in"], [data-state][class*="data-[state=closed]:animate-out"]'
            );
          })(),

          // Check for shadcn/ui specific class combinations
          hasShadcnStyles:
            document.querySelector(
              '[class*="rounded-md bg-background p-4 text-foreground"]'
            ) !== null,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    // Radix is much easier to detect. So the strategy is to increase shadcn/ui score based on low confidence patterns
    // and decrease the score based in case radix is not detected.
    name: 'radix' as const,
    score: -3,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Solve circular category access
    dependencies: (analysis: any) => {
      return analysis.stylingLibraries.items.radix?.confidence < 1;
    },
  },
];
