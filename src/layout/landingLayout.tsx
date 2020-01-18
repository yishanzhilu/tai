/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { Divider } from '@yishanzhilubp/core';
import { Navbar } from './common/navbar';
import { ThemeLayout } from './themeLayout';

export function LandingLayout({ children }): React.ReactElement {
  return (
    <ThemeLayout>
      <Navbar />
      {children}
      <Divider />
      <footer
        style={{
          textAlign: 'center',
          margin: '10px',
          color: '#8c8c8c',
        }}
      >
        © {new Date().getFullYear()} Yishan Authors
      </footer>
    </ThemeLayout>
  );
}
