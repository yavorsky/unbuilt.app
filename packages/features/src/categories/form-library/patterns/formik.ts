// Formik — unique string identifiers and DOM patterns
export const formik = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/formik[.\-@/]/, /node_modules\/formik/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"formik"/, // Package self-reference
      /"FormikProvider"/, // React context provider name (preserved as string)
      /"FormikContext"/, // Context name
      /"useFormik"/, // Named export as string key
      /"withFormik"/, // HOC name
    ],
  },
];
