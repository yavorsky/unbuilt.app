export const reactHookForm = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/react-hook-form/],
    filenames: [/react-hook-form/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/useForm\s*\(/, /useFormContext\s*\(/, /useFieldArray\s*\(/, /useWatch\s*\(/, /FormProvider/],
  },
];
