import { Page } from 'playwright';

// React Hook Form — well-known named exports and unique string identifiers
export const reactHookForm = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/react-hook-form[.\-@/]/, /node_modules\/react-hook-form/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"react-hook-form"/, // Self-reference in bundle
      /"useForm"/, // Named export as string key (when re-exported)
      /"FormProvider"/, // Component name preserved as string for React DevTools
      /"useFormContext"/, // Named export
      /"useFieldArray"/, // Named export
      /"useController"/, // Named export
    ],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // React Hook Form adds specific data attributes to form elements
        const hasRHFAttributes = document.querySelector('[name]') !== null &&
          document.querySelector('form') !== null;
        // Check for RHF's DevTools
        const hasDevTools = !!document.querySelector('[data-rhf-devtools]');
        // Check inline scripts for the package name
        const scripts = Array.from(document.querySelectorAll('script'));
        const hasInBundle = scripts.some((s) =>
          (s.textContent || '').includes('react-hook-form')
        );
        return hasDevTools || hasInBundle;
      });
    },
  },
];
