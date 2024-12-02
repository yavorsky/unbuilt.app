import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

// Create base config that can be extended
export const baseConfig = [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'prettier': prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'prettier/prettier': 'error',  // Enable prettier rules
      ...prettierConfig.rules,  // Disable rules that conflict with prettier
    },
  },
];

// Default export for root config
export default baseConfig;
