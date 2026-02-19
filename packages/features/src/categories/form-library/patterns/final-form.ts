// Final Form — package references and unique string identifiers
export const finalForm = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/final-form[.\-@/]/, /react-final-form[.\-@/]/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"final-form"/, // Package self-reference
      /"react-final-form"/, // Package reference
      /"FORM_ERROR"/, // Final Form's unique error constant (exported as string)
    ],
  },
];
