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
} from '@yishanzhilubp/core';

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
        {/* <NavbarGroup align={Alignment.RIGHT}>
          <Link href="/login">
            <AnchorButton
              intent="primary"
              className={Classes.MINIMAL}
              text="内测用户登录"
            />
          </Link>
        </NavbarGroup> */}
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
