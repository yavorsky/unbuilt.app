// Yup — rely on filename detection primarily.
// Yup's minified bundle doesn't have many unique string identifiers.
// Also detectable via Formik's Yup-specific exports.
export const yup = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/\/yup[.\-@/]/, /node_modules\/yup/],
  },
  {
    name: 'formikIntegration' as const,
    score: 0.7,
    // Formik ships Yup-specific exports — if these exist, Yup is almost certainly present
    scripts: [/exports\.validateYupSchema\b/, /exports\.yupToFormErrors\b/],
  },
];
