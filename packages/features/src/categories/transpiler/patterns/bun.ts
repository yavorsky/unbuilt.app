import { Page } from 'playwright';

export const bun = [
  {
    name: 'bunSpecific' as const,
    score: 0.4, // Higher score for Bun-specific features
    scripts: [
      // Bun's unique module features not present in SWC
      /\["bun:wrap"\]/,
      /Bun\.(?:consume|resolveSync|resolve|fileURLToPath)\(/,

      // Bun's own macro system
      /\bBun\.(?:env|main|file|which)\b/,

      // Bun's unique optimizations
      /\$blazepack\$__(?:require|import)/,

      // Bun's error handling and runtime
      /Bun\.(?:error|sleep)\(/,
      /\bBunPlugin\b/,
    ],
  },
  {
    name: 'swcModifications' as const,
    score: 0.3,
    scripts: [
      // Bun's modifications to SWC's async transforms
      /async\s+function\s*\w*\s*\(\)\s*\{\s*return\s+await\s+Bun\./,

      // Bun's custom handling of SWC's module system
      /import\s*\.\s*meta\s*\.\s*(?:path|url)\s*=\s*Bun\./,

      // Bun's modifications to SWC's class handling
      /class\s+\w+\s*extends\s+Bun\./,

      // Bun's overrides of SWC's runtime functions
      /__toBun\(/,
      /Bun\.unwrap\(/,
    ],
  },
  {
    name: 'fastRefresh' as const,
    score: 0.3,
    scripts: [
      // Bun's own Fast Refresh implementation
      /__FastRefreshRuntime__\.register\(/,
      /__FastRefreshRuntime__\.performReactRefresh\(/,
      /\$RefreshReg\$\(/,
      /\$RefreshSig\$\(/,
    ],
  },
  {
    name: 'optimization' as const,
    score: 0.2,
    scripts: [
      // Bun-specific code optimizations not present in SWC
      /\/\*\s*@bun-safe\s*\*\//,
      /\/\*\s*@bun-types\s*\*\//,
      /\/\*\s*@bun-runtime\s*\*\//,

      // Bun's own dead code elimination markers
      /\/\*\s*@pure\s*\*\/\s*Bun\./,
      /\/\*\s*@__PURE__\s*\*\/\s*Bun\./,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Only check unique Bun features that SWC definitely won't have
        return typeof window.Bun !== 'undefined';
      });
    },
  },
];
