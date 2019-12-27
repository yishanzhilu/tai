/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@yishanzhilubp/core';

import { useGlobalContext } from '@/src/contexts/global';


export default function() {
  const [globalState, dispatchGlobalAction] = useGlobalContext();
  return (
    <div>
      schedule
      <Link href="/workspace/dashboard">to dashboard</Link>
      <div>{globalState.theme}</div>
      <Button
        onClick={() =>
          dispatchGlobalAction({ type: 'SetTheme', newTheme: 'dark' })
        }
      >
        change theme
      </Button>
    </div>
  );
}
