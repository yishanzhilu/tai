/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

/* eslint-disable prefer-destructuring */

export const AUTHOR = process.env.AUTHOR;

export const API_URL = process.env.API_URL;

export const NODE_ENV = process.env.NODE_ENV;

export const IS_PRODUCTION = NODE_ENV === 'production';

export const SERVER_API_URL = process.env.SERVER_API_URL;

export const VERSION = process.env.VERSION;

export const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;

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
  done: { color: '#979797', text: '已完成' },
  drop: { color: '#D8D8D8', text: '已终止' },
};
