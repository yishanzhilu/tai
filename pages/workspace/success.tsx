/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import Link from 'next/link';

const WorkSpace = (): React.ReactElement => {
  return (
    <div>
      <Link href="/login">
        <a>About Us</a>
      </Link>
      <h1>成就</h1>
    </div>
  );
};

export default WorkSpace;
