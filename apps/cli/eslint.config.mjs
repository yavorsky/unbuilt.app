import { baseConfig } from '../../eslint.config.mjs';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  ...baseConfig,
  {
    ignores: ['node_modules'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
  },
];
