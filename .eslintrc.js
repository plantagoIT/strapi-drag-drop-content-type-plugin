'use strict';

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsdoc/recommended',
  ],
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
  overrides: [
    // Linting rules for browser environment
    {
      env: {
        browser: true,
      },
      files: ['admin/**/*.{js,jsx,tx,tsx}'],
      parserOptions: {
        sourceType: 'module',
      },
    },
    // Lingting rules for Node.js server environment
    {
      env: {
        node: true,
      },
      files: ['server/**/*.{js,ts}'],
      parserOptions: {
        sourceType: 'module',
      },
    },
    // Lingting rules for other standalone .js files
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {},
};
