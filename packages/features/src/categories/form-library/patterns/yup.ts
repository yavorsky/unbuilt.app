// Yup detection — same principle: only match strings/identifiers that survive minification
export const yup = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/yup[.\-@/]/, /node_modules\/yup/],
  },
  {
    name: 'errorStrings' as const,
    score: 0.9,
    scripts: [
      // Yup's internal type strings and error messages
      /"ValidationError"/, // Yup's error class name
      /"yup:"/,  // Internal debug prefix
      /"abortEarly"/, // Yup-specific option names (string keys)
      /"stripUnknown"/, // Yup-specific option
      /"this must be a \`"/, // Yup's default error message prefix
      /"this is a required field"/, // Yup's default required message
    ],
  },
  {
    name: 'resolverIntegration' as const,
    score: 0.8,
    scripts: [/"yupResolver"/, /yupResolver/],
    filenames: [/hookform.*resolvers.*yup/, /resolvers\/yup/],
  },
];
