/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

import * as React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DefaultDocumentIProps,
  NextDocumentContext,
} from 'next/document';
import { Global, css } from '@emotion/core';
import { Emotion } from '@iron-branch/core';

class MyDocument extends Document {
  public static async getInitialProps(
    ctx: NextDocumentContext
  ): Promise<DefaultDocumentIProps> {
    const initialProps: DefaultDocumentIProps = await Document.getInitialProps(
      ctx
    );
    return { ...initialProps };
  }

  public render(): React.ReactElement {
    return (
      <Html>
        <Head>
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
          <link rel="icon" type="image/x-icon" href="../static/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="../static/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="../static/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="../static/favicon-16x16.png"
          />
        </Head>
        <body>
          <Global
            styles={css`
              ${Emotion.global}
            `}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
