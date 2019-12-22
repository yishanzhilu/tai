const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'header', 'react-hooks'],
  env: {
    'jest/globals': true,
    browser: true,
    node: true,
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
    // Disable all jsx-ally rules for mvp
    // To reset, uncomment following line and remove airbnb-base and airbnb/rules/react
    // 'airbnb',
    'airbnb-base',
    'airbnb/rules/react',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'max-len': [
      'error',
      {
        code: 80,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignoreStrings: true,
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.tsx'] }],
    'header/header': [
      'error',
      'block',
      '*\n * Copyright (c) 2019 Yishan Authors\n *\n * All rights reserved\n ',
    ],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    'react/jsx-props-no-spreading': ['off'],
    'import/prefer-default-export': ['off'],
    'react/prop-types': ['off'],
    '@typescript-eslint/interface-name-prefix': ['error', 'always'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', args: 'after-used', varsIgnorePattern: '^_' },
    ],
    'no-console': ['off'],
    'no-param-reassign': ['off'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
          '**/jest.config.js', // jest config
          '**/jest.setup.js', // jest setup
        ],
        optionalDependencies: false,
      },
    ],
  },
  overrides: [
    {
      files: ['*.test.tsx', '*.test.ts'],
      rules: {
        'header/header': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
