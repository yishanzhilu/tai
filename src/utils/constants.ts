/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { GITHUB_OAUTH_CLIENT_ID } from './env';

export const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_OAUTH_CLIENT_ID}&redirect_uri=http://dev.yishan.co/oauth/github/redirect`;
