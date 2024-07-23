import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,

  {
    ignores: ['dist/*']
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    },

    rules: {
      'no-unused-vars': [
        'error',
        { 'argsIgnorePattern': '^(_|t$)' }
      ],
      'no-undef': 'error'
    }
  }
];
