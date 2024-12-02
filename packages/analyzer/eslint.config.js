import { baseConfig } from '../../eslint.config.js';
import globals from 'globals';

export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    },
  },
];
