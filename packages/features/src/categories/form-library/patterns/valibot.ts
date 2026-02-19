// Valibot detection — match package references and unique string identifiers
export const valibot = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/valibot[.\-@/]/, /node_modules\/valibot/],
  },
  {
    name: 'errorStrings' as const,
    score: 0.9,
    scripts: [
      /"ValiError"/, // Valibot's error class name as string
      /"valibot"/, // Package self-reference in bundles
    ],
  },
  {
    name: 'resolverIntegration' as const,
    score: 0.8,
    scripts: [/"valibotResolver"/, /valibotResolver/],
    filenames: [/hookform.*resolvers.*valibot/, /resolvers\/valibot/],
  },
];
