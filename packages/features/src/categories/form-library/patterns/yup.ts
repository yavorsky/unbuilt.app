export const yup = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\byup\b/],
    filenames: [/yup/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.7,
    scripts: [/yup\.object\s*\(/, /yup\.string\s*\(/, /yup\.number\s*\(/, /yupResolver\s*\(/],
  },
];
