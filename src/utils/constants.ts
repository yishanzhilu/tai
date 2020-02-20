/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

/* eslint-disable prefer-destructuring */
import getConfig from 'next/config';

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { publicRuntimeConfig } = getConfig();

export const AUTHOR = publicRuntimeConfig.AUTHOR;

export const API_URL = publicRuntimeConfig.API_URL;

export const IS_PRODUCTION = publicRuntimeConfig.IS_PRODUCTION;

export const SERVER_API_URL = publicRuntimeConfig.SERVER_API_URL;

export const VERSION = publicRuntimeConfig.VERSION;

export const GITHUB_OAUTH_CLIENT_ID =
  publicRuntimeConfig.GITHUB_OAUTH_CLIENT_ID;

export const IS_SERVER = typeof window === 'undefined';

export const IS_BROWSER = !IS_SERVER;

export const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_OAUTH_CLIENT_ID}`;

export const REFRESH_TOKEN_EXPIRE_DAYS = 365;

export const REFRESH_TOKEN_KEY = 'x-tai-everest-fresh-token';

export const USER_ID_KEY = 'x-tai-everest-user-id';

export const TOKEN_KEY = 'x-tai-everest-token';

export const STATUS_CONFIG_MAP = {
  doing: { color: '#db3737', text: '进行中' },
  todo: { color: '#4A90E2', text: '规划中' },
  done: { color: '#F5A623', text: '已完成' },
  drop: { color: '#D8D8D8', text: '已终止' },
};
