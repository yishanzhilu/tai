/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

import App, { Container, DefaultAppIProps, NextAppContext } from 'next/app';
import Head from 'next/head';
import * as React from 'react';
import { ThemeProvider } from 'emotion-theming';

const theme = {
  colors: {
    primary: '#1890ff',
    link: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    heading: 'rgba(0, 0, 0, 0.85)',
    text: 'rgba(0, 0, 0, 0.65)',
    textSecondary: 'rgba(0, 0, 0, .45)',
    disabled: 'rgba(0, 0, 0, .25)',
    borderBase: '#d9d9d9',
  },
};

export default class MyApp extends App {
  public static async getInitialProps({
    Component,
    ctx,
  }: NextAppContext): Promise<DefaultAppIProps> {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  public render(): React.ReactElement {
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Head>
            <title>移山 - 为你所爱</title>
          </Head>
          <Component {...pageProps} />
        </Container>
      </ThemeProvider>
    );
  }
}
