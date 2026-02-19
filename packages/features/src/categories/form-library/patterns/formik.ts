export const formik = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\bformik\b/],
    filenames: [/formik/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/useFormik\s*\(/, /\bFormik\b/, /\bField\b.*\bformik\b/, /withFormik\s*\(/],
  },
];
