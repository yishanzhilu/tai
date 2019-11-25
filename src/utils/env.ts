/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { API_URL, IS_PRODUCTION, SERVER_API_URL } = publicRuntimeConfig;

export const AUTHOR = 'Yishan Authors';

export const IS_SERVER = typeof window === 'undefined';
export const IS_BROWSER = !IS_SERVER;

export { API_URL, IS_PRODUCTION, SERVER_API_URL };
