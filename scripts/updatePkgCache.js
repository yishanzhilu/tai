/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const package = require('../package.json');

fs.writeFileSync(
  './package.cache.json',
  JSON.stringify(
    {
      name: package.name,
      author: package.author,
      license: package.license,
      private: package.private,
      dependencies: package.dependencies,
      devDependencies: package.devDependencies,
      repository: package.repository,
    },
    null,
    '  '
  )
);
