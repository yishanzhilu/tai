/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

module.exports = {
  publicRuntimeConfig: {
    API_URL: process.env.API_URL || '/api/v1',
    SERVER_API_URL: process.env.SERVER_API_URL || 'http://dev.yishan.co/api/v1',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
  },
};
