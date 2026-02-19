// Verified against minified bundle: cdn.jsdelivr.net/npm/formik@2.4.6/dist/formik.cjs.production.min.js
// Named exports survive: Formik, FormikProvider, FormikContext, FormikConsumer, useFormik, useField, withFormik, etc.
export const formik = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/formik[.\-@/]/],
  },
  {
    name: 'namedExports' as const,
    score: 0.9,
    scripts: [
      // CJS named exports verified in minified bundle
      /exports\.Formik\b/,
      /exports\.FormikProvider\b/,
      /exports\.FormikContext\b/,
      /exports\.FormikConsumer\b/,
      /exports\.useFormik\b/,
      /exports\.useField\b/,
      /exports\.withFormik\b/,
      /exports\.FastField\b/,
      /exports\.FieldArray\b/,
      /exports\.ErrorMessage\b/,
    ],
  },
  {
    name: 'uniqueExports' as const,
    score: 0.8,
    scripts: [
      // These are unique enough to Formik when co-occurring
      /exports\.validateYupSchema\b/,
      /exports\.yupToFormErrors\b/,
    ],
  },
];
