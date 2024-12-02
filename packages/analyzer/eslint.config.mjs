import { baseConfig } from '../../eslint.config.mjs';
import globals from 'globals';

export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-useless-escape': 'off',
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    },
  },
];
