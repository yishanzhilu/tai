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
import { ThemeLayout } from './themeLayout';

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
        <Link href="/settings/app" passHref>
          <a className={classNames([pathname === '/settings/app' && 'active'])}>
            应用配置
          </a>
        </Link>
      </li>
      <style jsx>
        {`
          ul {
            box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.15),
              0 0 0 rgba(16, 22, 26, 0), 0 0 0 rgba(16, 22, 26, 0);
            margin: -1px;
          }
          li {
            box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.15),
              0 0 0 rgba(16, 22, 26, 0), 0 0 0 rgba(16, 22, 26, 0);
          }
          a {
            display: block;
            border-left: 2px solid rgba(0, 0, 0, 0);
            font-weight: 500;
            color: inherit;
            line-height: 32px;
            height: 32px;
            padding-left: 24px;
          }
          a:hover {
            text-decoration: none;
            color: inherit;
            font-weight: 600;
          }

          a.active {
            border-left-color: #e53934;
            font-weight: 900;
          }
        `}
      </style>
    </ul>
  );
}

export function SettingLayout({ children }): React.ReactElement {
  return (
    <ThemeLayout>
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
        <div style={{ marginLeft: 20, width: '100%', maxWidth: '805px' }}>
          {children}
        </div>
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
    </ThemeLayout>
  );
}
