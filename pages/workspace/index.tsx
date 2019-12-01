/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { redirect } from '@/src/utils/funcs';

export default function Workspace() {
  React.useEffect(() => {
    redirect('/workspace/dashboard');
  });
  return <div />
}
