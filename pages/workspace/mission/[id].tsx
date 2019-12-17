/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Mission = (): React.ReactElement => {
  const router = useRouter();
  const { id: mid } = router.query;
  return (
    <div>
      <Link href="/login">
        <a>About Us</a>
      </Link>
      <h1>Mission {mid}</h1>
    </div>
  );
};

export default Mission;
