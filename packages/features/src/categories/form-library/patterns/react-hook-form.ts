// Verified against minified bundle: cdn.jsdelivr.net/npm/react-hook-form@7.54.2/dist/index.cjs.min.js
// Named exports survive: FormProvider, useForm, useController, useFieldArray, useWatch, useFormContext, Controller
export const reactHookForm = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/react-hook-form[.\-@/]/],
  },
  {
    name: 'namedExports' as const,
    score: 0.9,
    scripts: [
      // CJS named exports verified in minified bundle
      /exports\.FormProvider/,
      /exports\.useForm\b/,
      /exports\.useController\b/,
      /exports\.useFieldArray\b/,
      /exports\.useFormContext\b/,
      /exports\.Controller\b/,
    ],
  },
  {
    name: 'esmExports' as const,
    score: 0.9,
    scripts: [
      // ESM export names — these survive as identifiers in ESM bundles
      /\bflexRender\b.*\buseReactTable\b|\buseReactTable\b.*\bflexRender\b/, // co-occurrence check
      /\bFormProvider\b.*\buseForm\b/, // RHF co-occurrence
    ],
  },
];
