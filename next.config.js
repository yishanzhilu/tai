/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const withTypescript = require('@zeit/next-typescript');
const aliases = require('./alias-config');

module.exports = withTypescript({
  webpack(config) {
    const { alias } = config.resolve;
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias = {
      ...alias,
      ...aliases,
    };
    return config;
  },
});
