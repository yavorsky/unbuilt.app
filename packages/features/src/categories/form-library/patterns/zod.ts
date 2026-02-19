export const zod = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\bzod\b/],
    filenames: [/zod/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.7,
    scripts: [/z\.object\s*\(/, /z\.string\s*\(/, /z\.number\s*\(/, /z\.array\s*\(/, /z\.enum\s*\(/, /zodResolver\s*\(/],
  },
];
