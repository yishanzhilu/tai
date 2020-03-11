/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

/* eslint-disable @typescript-eslint/no-var-requires, no-param-reassign  */
const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
require('dotenv').config();
const packageJSON = require('./package.json');

module.exports = withBundleAnalyzer({
  webpack(config) {
    const { alias } = config.resolve;
    config.resolve.alias = {
      ...alias,
      '@': path.resolve(__dirname, './'),
    };
    return config;
  },
  publicRuntimeConfig: {
    TEST_VAR: process.env.TEST_VAR,
    API_URL: process.env.API_URL,
    SERVER_API_URL: process.env.SERVER_API_URL,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    VERSION: packageJSON.version,
    AUTHOR: packageJSON.author,
    GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
  },
});
