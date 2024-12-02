export const esbuild = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Core esbuild markers
      /\/\*\s*esbuild\s*/,
      /__esbuild_/,
      /__toESM/,
      /__commonJS/,
      /__require/,
      /__export/,

      // Module system
      /__toCommonJS/,
      /__markAsModule/,
      /__reExport/,
      /__importDefault/,
      /__importStar/,
      /__importMeta/,

      // Error handling
      /__error/,
      /__throws/,

      // Development tools
      /__DEV__/,
      /process\.env\.NODE_ENV/,

      // Unique variable naming patterns
      /\$[0-9a-f]{1,6}\$/,
      /\$_\$/,
      /\$[a-zA-Z0-9]+\$[0-9]+/,

      // Source maps
      /\/\/# sourceMappingURL=data:application\/json;base64,/,
      /\/\*# sourceMappingURL=/,

      // JSX transforms
      /_jsx\(/,
      /_jsxs\(/,
      /_Fragment/,
      /jsx-runtime/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Main output
      /bundle\.[a-f0-9]{8}\.js$/,
      /index\.[a-f0-9]{8}\.js$/,
      /main\.[a-f0-9]{8}\.js$/,

      // Chunks
      /chunk\.\w+\.js$/,
      /chunks\/\w+\.js$/,
      /\w+\.[a-f0-9]{8}\.chunk\.js$/,

      // Environment specific
      /\w+\.development\.js$/,
      /\w+\.production\.js$/,

      // Dynamic imports
      /chunks\/async\/\w+\.js$/,
      /chunks\/dynamic\/\w+\.js$/,
    ],
  },
];
