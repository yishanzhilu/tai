/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Divider,
  Alignment,
  AnchorButton,
} from '@yishanzhilubp/core';

import { GITHUB_OAUTH_URL } from '@/src/utils/constants';

export function LandingLayout({ children }): React.ReactElement {
  return (
    <div>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>
            <img
              src="/static/layout/logo.png"
              alt="logo"
              style={{ width: 30, height: 30 }}
            />
          </NavbarHeading>
          <NavbarHeading>移山</NavbarHeading>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <AnchorButton minimal intent="primary" href={GITHUB_OAUTH_URL}>
            内测用户登录
          </AnchorButton>
        </NavbarGroup>
      </Navbar>
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
    </div>
  );
}
