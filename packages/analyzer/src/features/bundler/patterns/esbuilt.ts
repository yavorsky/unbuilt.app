export const esbuild = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // Core esbuild markers and runtime - highly specific
      /\/\*\s*esbuild\s*/, // esbuild comment marker
      /__esbuild_/, // esbuild runtime prefix
      /__toESM/, // esbuild module conversion
      /__commonJS/, // esbuild CommonJS handling
    ],
  },
  {
    name: 'module-system' as const,
    score: 0.8,
    runtime: [
      // ESBuild-specific module transformations
      /__toCommonJS/, // CommonJS conversion
      /__markAsModule/, // Module marking
      /__reExport/, // Re-export handling
    ],
  },
  {
    name: 'jsx' as const,
    score: 0.6,
    runtime: [
      // ESBuild's JSX implementation markers
      /__create_element__/,
      /\/\*\s*@jsxRuntime\s+classic\s*\*\//,
      /\/\*\s*@jsxImportSource\s+/,
    ],
  },
  {
    name: 'identifiers' as const,
    score: 0.4,
    runtime: [
      // ESBuild's unique variable naming patterns
      /\$[0-9a-f]{1,6}\$/, // ESBuild's hash-based identifiers
      /\$[a-zA-Z0-9]+\$[0-9]+/, // ESBuild's numbered identifiers
    ],
  },
];
