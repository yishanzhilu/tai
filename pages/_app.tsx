/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import NextError from 'next/error';
import NProgress from 'nprogress';
import Router from 'next/router';
import nextCookie from 'next-cookies';

import { FocusStyleManager } from '@yishanzhilu/blueprint-core';
import 'normalize.css/normalize.css';
import '@yishanzhilu/blueprint-core/lib/css/blueprint.css';
import '@yishanzhilu/blueprint-datetime/lib/css/blueprint-datetime.css';
import '@yishanzhilu/blueprint-select/lib/css/blueprint-select.css';
// import AuthingSSO from '@authing/sso';
import Validator from 'validatorjs';

import { setUpConsole, redirect } from '@/src/utils/funcs';
import { IS_SERVER } from '@/src/utils';

import {
  defaultGlobalState,
  getInitialGlobalState,
  IGlobalState,
  GlobalContextProvider,
} from '@/src/contexts/global';
import { ErrorBoundary } from '@/src/components/errors/error-handling';

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

const publicPaths = ['/login', '/'];

export default class TaiAPP extends App<{
  initialGlobalState: IGlobalState;
}> {
  public static async getInitialProps({ Component, ctx }: AppContext) {
    try {
      console.info('TaiAPP | pathname', ctx.pathname);
      const { everestToken: token } = nextCookie(ctx);

      const pageProps = Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {};

      if (publicPaths.some(p => p === ctx.pathname)) {
        return { pageProps, initialGlobalState: defaultGlobalState };
      }

      if (!token) {
        // 没有 token，去login
        redirect('/login', ctx);
        return { pageProps, initialGlobalState: defaultGlobalState };
      }
      let initialGlobalState = defaultGlobalState;
      if (IS_SERVER) {
        initialGlobalState = await getInitialGlobalState(token);
      }
      // Run getInitialProps from high order PageComponent

      return {
        pageProps,
        initialGlobalState,
      };
    } catch (error) {
      console.error(`TaiAPP.getInitialProps | error: ${error}`);
      // token 错误，删除通过 redirect 的 removeCookie 删除 token
      redirect('/login', ctx, true);
      return { pageProps: {}, initialGlobalState: defaultGlobalState };
    }
  }

  public render() {
    const { Component, pageProps, initialGlobalState } = this.props;
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
        </Head>
        <GlobalContextProvider initialGlobalState={initialGlobalState}>
          <ErrorBoundary fallback={<NextError statusCode={500} />}>
            <Component {...pageProps} />
          </ErrorBoundary>
        </GlobalContextProvider>
        <style jsx global>{`
          .bp3-card {
            padding: 20px 40px;
          }
          /* Make clicks pass-through */
          #nprogress {
            pointer-events: none;
          }

          #nprogress .bar {
            background: #db3737;

            position: fixed;
            z-index: 1031;
            top: 0;
            left: 0;

            width: 100%;
            height: 2px;
          }

          /* Fancy blur effect */
          #nprogress .peg {
            display: block;
            position: absolute;
            right: 0px;
            width: 100px;
            height: 100%;
            box-shadow: 0 0 10px #db3737, 0 0 5px #db3737;
            opacity: 1;

            -webkit-transform: rotate(3deg) translate(0px, -4px);
            -ms-transform: rotate(3deg) translate(0px, -4px);
            transform: rotate(3deg) translate(0px, -4px);
          }

          /* Remove these to get rid of the spinner */
          #nprogress .spinner {
            display: block;
            position: fixed;
            z-index: 1031;
            top: 15px;
            right: 15px;
          }

          #nprogress .spinner-icon {
            width: 18px;
            height: 18px;
            box-sizing: border-box;

            border: solid 2px transparent;
            border-top-color: #db3737;
            border-left-color: #db3737;
            border-radius: 50%;

            -webkit-animation: nprogress-spinner 400ms linear infinite;
            animation: nprogress-spinner 400ms linear infinite;
          }

          .nprogress-custom-parent {
            overflow: hidden;
            position: relative;
          }

          .nprogress-custom-parent #nprogress .spinner,
          .nprogress-custom-parent #nprogress .bar {
            position: absolute;
          }

          @-webkit-keyframes nprogress-spinner {
            0% {
              -webkit-transform: rotate(0deg);
            }
            100% {
              -webkit-transform: rotate(360deg);
            }
          }
          @keyframes nprogress-spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </>
    );
  }
}
