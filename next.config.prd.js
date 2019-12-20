/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

 /* eslint-disable @typescript-eslint/no-var-requires, no-param-reassign  */
const packageJSON = require('./package.json');

module.exports = {
  publicRuntimeConfig: {
    API_URL: process.env.API_URL || '/api/v1',
    SERVER_API_URL: process.env.SERVER_API_URL || 'http://dev.yishan.co/api/v1',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    VERSION: packageJSON.version,
  },
};
