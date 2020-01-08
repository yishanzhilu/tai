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
import Head from 'next/head';

import { GITHUB_OAUTH_URL } from '@/src/utils/constants';
import { NavSearch } from '../components/search/navSearch';

export function LandingLayout({ children }): React.ReactElement {
  return (
    <div>
      <Head>
        <title>移山 · 为你所爱</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://cdn.jsdelivr.net/npm/normalizecss@3.0.0/normalize.css"
          rel="stylesheet"
        />
        {/* <link
            href="https://cdn.jsdelivr.net/npm/@blueprintjs/core@3.22.3/lib/css/blueprint.css"
            rel="stylesheet"
          /> */}
        <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/favicon-16x16.png"
        />
      </Head>
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
          <NavSearch />
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
