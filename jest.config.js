/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
