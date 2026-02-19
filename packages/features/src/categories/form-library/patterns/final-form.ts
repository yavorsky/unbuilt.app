export const finalForm = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/final-form/, /react-final-form/],
    filenames: [/final-form/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/useField\s*\(/, /\bForm\b.*final-form/, /createForm\s*\(/],
  },
];
