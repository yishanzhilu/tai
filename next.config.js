/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

/* eslint-disable @typescript-eslint/no-var-requires, no-param-reassign  */
const withCSS = require('@zeit/next-css');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const aliasConfig = require('./alias-config');
const prdConfig = require('./next.config.prd');

module.exports = withCSS(
  withBundleAnalyzer({
    ...prdConfig,
    enabled: process.env.ANALYZE === 'true',
    webpack(config) {
      const { alias } = config.resolve;
      config.resolve.alias = {
        ...alias,
        ...aliasConfig,
      };
      return config;
    },
  })
);
