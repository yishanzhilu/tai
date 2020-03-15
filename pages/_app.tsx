/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import Head from 'next/head';
import NProgress from 'nprogress';
import Router from 'next/router';

import { FocusStyleManager } from '@yishanzhilubp/core';
import '@yishanzhilubp/core/lib/css/blueprint.css';
import '@yishanzhilubp/datetime/lib/css/blueprint-datetime.css';
import '@yishanzhilubp/select/lib/css/blueprint-select.css';

import { setUpConsole } from '@/src/utils/funcs';

import { VERSION } from '@/src/utils/constants';
import { GlobalContextsProvider } from '@/src/scopes/global';

FocusStyleManager.onlyShowFocusOnTabs();

console.log('TAI VERSION', VERSION);

setUpConsole();

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', url => {
  // eslint-disable-next-line no-undef
  TDAPP.onEvent('pagechange', url);

  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const TaiApp = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>移山 · 确立目标，达成理想</title>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <link
        href="https://cdn.jsdelivr.net/npm/normalizecss@3.0.0/normalize.css"
        rel="stylesheet"
      />

      <script src="http://sdk.talkingdata.com/app/h5/v1?appid=937C4ED6505B41A6B2DD5E860CFCE6C8&vn=1.1.0&vc=937C4ED6505B41A6B2DD5E860CFCE6C8" />
      <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
      {/* <link
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
      /> */}
    </Head>
    <GlobalContextsProvider>
      <Component {...pageProps} />
    </GlobalContextsProvider>
    <style jsx global>{`
      .bp3-card {
        padding: 20px 40px;
      }
      @media (max-width: 800px) {
        .bp3-card {
          padding: 15px;
        }
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

export default TaiApp;
