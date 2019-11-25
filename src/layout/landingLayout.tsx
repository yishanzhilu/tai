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
  Alignment,
  Classes,
  AnchorButton,
} from '@yishanzhilu/blueprint-core';
import Link from 'next/link';
import jsCookie from 'js-cookie';
import { redirect } from '../utils/funcs';

export function LandingLayout({
  children,
  isLoginPage = false,
}): React.ReactElement {
  if (jsCookie.get('everestToken')) {
    redirect('/workspace');
  }

  let button = {
    href: '/login',
    text: '登录',
  };
  if (isLoginPage) {
    button = {
      href: '/',
      text: '返回',
    };
  }
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
          <Link href={button.href}>
            <AnchorButton
              intent="danger"
              className={Classes.MINIMAL}
              text={button.text}
            />
          </Link>
        </NavbarGroup>
      </Navbar>
      {children}
    </div>
  );
}
