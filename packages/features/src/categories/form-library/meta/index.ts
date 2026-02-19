import { Meta } from '../../../types/meta.js';

export const meta = {
  reactHookForm: {
    name: 'React Hook Form',
    website: 'https://react-hook-form.com/',
    description: 'Performant, flexible and extensible forms with easy-to-use validation',
    Icon: null,
  } satisfies Meta,
  formik: {
    name: 'Formik',
    website: 'https://formik.org/',
    description: 'Build forms in React without the tears',
    Icon: null,
  } satisfies Meta,
  zod: {
    name: 'Zod',
    website: 'https://zod.dev/',
    description: 'TypeScript-first schema validation with static type inference',
    Icon: null,
  } satisfies Meta,
  yup: {
    name: 'Yup',
    website: 'https://github.com/jquense/yup',
    description: 'Schema builder for runtime value parsing and validation',
    Icon: null,
  } satisfies Meta,
  valibot: {
    name: 'Valibot',
    website: 'https://valibot.dev/',
    description: 'The modular and type safe schema library',
    Icon: null,
  } satisfies Meta,
  finalForm: {
    name: 'Final Form',
    website: 'https://final-form.org/',
    description: 'Framework agnostic, high performance, subscription-based form state management',
    Icon: null,
  } satisfies Meta,
} as const;
