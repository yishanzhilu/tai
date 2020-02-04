/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { GITHUB_OAUTH_CLIENT_ID } from './env';

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
