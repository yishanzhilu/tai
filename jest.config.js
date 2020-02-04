/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

module.exports = {
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
