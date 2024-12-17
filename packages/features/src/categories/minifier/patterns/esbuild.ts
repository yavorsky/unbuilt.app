export const esbuild = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // esbuild specific variable naming
      /\$\w+\$\d+/, // Variable pattern with numbers
      /\$[0-9a-f]{1,6}\$/, // Hex-based naming
      /\$_\$/, // Simple prefix

      // Module system
      /__toESM/,
      /__commonJS/,
      /__require/,
      /__export/,
      /__markAsModule/,
      /import_meta/,

      // Dynamic imports
      /__dynamic_import/,
      /__dynamic_require/,
      /__import_meta__/,

      // esbuild's specific error handling
      /__error/,
      /__throws/,
      /__load_error/,
    ],
  },
  {
    name: 'sourcemaps' as const,
    score: 0.3,
    runtime: [
      /\/\/# sourceMappingURL=data:application\/json;base64,.*?esbuild/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    filenames: [/\.esbuild\.js$/, /esbuild-min\.js$/, /-esbuild\.js$/],
  },
  {
    name: 'chunks' as const,
    score: 0.1,
    filenames: [/\.min\.js$/, /\.[a-f0-9]{8}\.js$/, /bundle\.[a-f0-9]+\.js$/],
  },
];
