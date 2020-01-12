/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import Head from 'next/head';
import { AnchorButton } from '@yishanzhilubp/core';
import { useRouter } from 'next/router';
import Link from 'next/link';

/* eslint-disable react/no-danger */

const styles: { [k: string]: React.CSSProperties } = {
  error: {
    color: '#646464',
    background: '#fff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 180,
  },
};

function TaiError({ statusCode, title = '出错了' }) {
  const { asPath } = useRouter();
  if (statusCode === 404) {
    title = `请求的 URL ${asPath} 不存在`;
  }
  return (
    <div style={styles.error}>
      <Head>
        <title>{statusCode} - 移山</title>
      </Head>
      <div>
        {statusCode ? (
          <h1 style={{ fontSize: 40, margin: 0 }}>{statusCode}</h1>
        ) : null}
        <p style={{ fontSize: 18, margin: '23px 0', maxWidth: 300 }}>{title}</p>
        <Link href="/" passHref>
          <AnchorButton intent="primary">返回首页</AnchorButton>
        </Link>
        {statusCode === 403 && (
          <Link
            href={{ pathname: '/login', query: { 'redirect-from': asPath } }}
            passHref
          >
            <AnchorButton style={{ marginLeft: 20 }}>登录访问</AnchorButton>
          </Link>
        )}
      </div>
      <img
        style={{ width: 150, height: 150, marginLeft: 100 }}
        src="/static/layout/logo.png"
        alt="page error"
      />
    </div>
  );
}

TaiError.getInitialProps = ({ res, err }) => {
  let statusCode: number;
  if (res) {
    statusCode = res.statusCode;
  } else if (err) {
    statusCode = res.statusCode;
  } else {
    statusCode = 404;
  }
  return { statusCode };
};

export default TaiError;
