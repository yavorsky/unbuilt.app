import { Page } from 'playwright';

// Verified against minified bundles: @radix-ui/react-dialog, @radix-ui/react-popover
// Survives: "data-state", "Dialog", "DialogContent", "DialogTrigger", "DialogOverlay"
// Radix component names are preserved as string literals in minified bundles.
// CSS custom properties like "--radix-popover-content-transform-origin" also survive.
export const radixUi = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/@radix-ui\//, /radix-ui/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.8,
    scripts: [
      // Radix component display names — verified in minified bundles
      /"DialogContent"/, /"DialogTrigger"/, /"DialogOverlay"/,
      /"PopoverContent"/, /"PopoverTrigger"/,
      /"DropdownMenuContent"/, /"DropdownMenuTrigger"/,
      /"SelectContent"/, /"SelectTrigger"/,
      /"TooltipContent"/, /"TooltipTrigger"/,
    ],
  },
  {
    name: 'cssCustomProperties' as const,
    score: 0.9,
    // Verified: Radix injects unique CSS custom properties
    stylesheets: [/--radix-popover-/, /--radix-dropdown-/, /--radix-tooltip-/],
    scripts: [/--radix-popover-/, /--radix-dropdown-/],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Radix adds data-state="open"|"closed" to its components
        // But data-state alone is not unique — check for radix CSS vars too
        const styles = Array.from(document.styleSheets);
        try {
          return styles.some((sheet) => {
            try {
              return Array.from(sheet.cssRules || []).some((rule) =>
                rule.cssText?.includes('--radix-')
              );
            } catch {
              return false; // CORS-blocked stylesheets
            }
          });
        } catch {
          return false;
        }
      });
    },
  },
];
