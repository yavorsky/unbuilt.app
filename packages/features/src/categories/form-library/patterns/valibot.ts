export const valibot = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\bvalibot\b/],
    filenames: [/valibot/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.7,
    scripts: [/v\.object\s*\(/, /v\.string\s*\(/, /v\.number\s*\(/, /valibotResolver\s*\(/],
  },
];
