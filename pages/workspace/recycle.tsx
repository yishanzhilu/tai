/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import Link from 'next/link';

import { withGlobalState } from '@/src/store/global';

const WorkSpace = (): React.ReactElement => {
  return (
    <div>
      <Link href='/workspace'>
        <a>About Us</a>
      </Link>
      <h1>回收站</h1>
    </div>
  );
};

export default withGlobalState(WorkSpace);
