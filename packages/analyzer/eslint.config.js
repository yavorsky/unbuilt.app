import { baseConfig } from '../../eslint.config.js';
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
      }
    },
  },
];
