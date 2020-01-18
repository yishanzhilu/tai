/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import getConfig from 'next/config';

const publicRuntimeConfigForTest = {
  IS_PRODUCTION: true,
};
export const AUTHOR = 'Yishan Authors';

export const IS_SERVER = typeof window === 'undefined';
export const IS_BROWSER = !IS_SERVER;

const { publicRuntimeConfig = publicRuntimeConfigForTest } = getConfig() || {};
const {
  API_URL,
  IS_PRODUCTION,
  SERVER_API_URL,
  VERSION,
  GITHUB_OAUTH_CLIENT_ID,
} = publicRuntimeConfig;

export {
  API_URL,
  IS_PRODUCTION,
  SERVER_API_URL,
  VERSION,
  GITHUB_OAUTH_CLIENT_ID,
};
