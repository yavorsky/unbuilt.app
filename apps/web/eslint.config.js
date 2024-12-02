import { baseConfig } from '../../eslint.config.js';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    },
  },
  {
    files: ['**/*.tsx'],
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];