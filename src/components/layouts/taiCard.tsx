/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { H3, Card } from '@yishanzhilubp/core';

export function TaiCard({ children, title }): React.ReactElement {
  return (
    <div style={{ marginBottom: 20 }}>
      <H3>{title}</H3>
      <Card style={{ marginTop: 20 }}>{children}</Card>
    </div>
  );
}
