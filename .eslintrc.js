const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'jest', 'header'],
  env: {
    'jest/globals': true,
  },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.js', '.tsx', '.ts', '.jsx', '.json'],
        map: [['@', path.resolve(__dirname, './')]],
      },
    },
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'max-len': [
      'error',
      { code: 80, ignoreTemplateLiterals: true, ignoreUrls: true, ignoreStrings: true },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.tsx'] }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    "header/header": [2, "block", "*\n * Copyright (c) 2019 Yishan Authors\n *\n * All right reserved\n "]
  },
};
