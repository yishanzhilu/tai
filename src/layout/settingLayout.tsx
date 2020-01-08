/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { Divider, Classes } from '@yishanzhilubp/core';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import { Navbar } from './common/navbar';

function SettingSidebar() {
  const { pathname } = useRouter();
  return (
    <ul className={Classes.LIST_UNSTYLED}>
      <li>
        <Link href="/settings/profile" passHref>
          <a
            className={classNames([
              pathname === '/settings/profile' && 'active',
            ])}
          >
            个人信息
          </a>
        </Link>
      </li>
      <li>
        <Link href="/settings/account" passHref>
          <a
            className={classNames([
              pathname === '/settings/account' && 'active',
            ])}
          >
            账户管理
          </a>
        </Link>
      </li>
      <style jsx>
        {`
          ul {
            border: 1px solid #e8e8e8;
          }
          li {
            border-bottom: 1px solid #e8e8e8;
          }
          a {
            display: block;
            border-left: 2px solid rgba(0, 0, 0, 0);
            font-weight: 500;
            color: #595959;
            line-height: 32px;
            height: 32px;
            padding-left: 24px;
          }
          a:hover {
            text-decoration: none;
          }

          a.active {
            color: #262626;
            border-left-color: #e53934;
          }
        `}
      </style>
    </ul>
  );
}

export function SettingLayout({ children }): React.ReactElement {
  return (
    <div>
      <Head>
        <title>设置 · 移山</title>
      </Head>
      <Navbar />
      <main
        style={{
          maxWidth: 1056,
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '24px 16px 32px',
          display: 'flex',
          minHeight: 'calc(100vh - 90px)',
        }}
      >
        <div style={{ width: 250 }}>
          <SettingSidebar />
        </div>
        <div style={{ marginLeft: 20, width: '100%' }}>{children}</div>
      </main>
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
