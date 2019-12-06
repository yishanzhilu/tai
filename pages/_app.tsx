/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import NProgress from 'nprogress';
import Router from 'next/router';

import { FocusStyleManager } from '@yishanzhilu/blueprint-core';
import 'normalize.css/normalize.css';
import '@yishanzhilu/blueprint-core/lib/css/blueprint.css';
import '@yishanzhilu/blueprint-datetime/lib/css/blueprint-datetime.css';
// import AuthingSSO from '@authing/sso';
import Validator from 'validatorjs';

import { setUpConsole } from '@/src/utils/funcs';

Validator.useLang('zh');

FocusStyleManager.onlyShowFocusOnTabs();

setUpConsole();
NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', url => {
  console.debug(`routeChangeStart | url: ${url}`);
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default class TaiAPP extends App {
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <title>移山 · 为你所爱</title>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
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
          <link rel="stylesheet" type="text/css" href="/nprogress.css" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}
