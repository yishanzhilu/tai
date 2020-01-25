/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';
import { Spinner, Classes } from '@yishanzhilubp/core';
import cookie from 'js-cookie';

import { f, HandleError } from '@/src/api';
import { LandingLayout } from '@/src/layout';
import { Flex } from '@/src/components/flex';
import { IPageProps } from '@/src/model/utils';
import TaiError from '@/pages/_error';
import { redirect } from '@/src/utils/funcs';
import {
  TOKEN_KEY,
} from '@/src/utils/constants';

interface IProps extends IPageProps {
  token?: string;
}

const OauthGithubRedirect: NextPage<IProps> = ({
  token,
  error,
}) => {
  React.useEffect(() => {
    console.debug('OauthGithubRedirect useEffect, error:', error);
    if (token) {
      cookie.set(TOKEN_KEY, `Bearer ${token}`, {
        expires: 365,
      });
      redirect('/workspace/dashboard');
    }
  }, [token]);
  if (error) {
    return <TaiError statusCode={error.statusCode} title={error.title} />;
  }
  return (
    <LandingLayout>
      <main>
        <Flex
          justifyContent="center"
          alignItems="center"
          dir="column"
          childMargin={20}
        >
          <Spinner />
          <p className={Classes.TEXT_LARGE}>登录中</p>
        </Flex>
      </main>
      <style jsx>
        {`
          main {
            padding-top: 30vh;
            min-height: calc(100vh - 95px);
          }
        `}
      </style>
    </LandingLayout>
  );
};

OauthGithubRedirect.getInitialProps = async ctx => {
  const { code } = ctx.query;
  console.debug('OauthGithubRedirect getInitialProps, code:', code);

  if (code) {
    try {
      const oauthResp = await f.get<{
        token: string;
      }>('/user/oauth/github', {
        params: { code },
      });
      return oauthResp.data;
    } catch (err) {
      const { message, code: errCode } = HandleError(err);
      return {
        error: { statusCode: errCode, title: message },
      };
    }
  } else {
    return {
      error: { statusCode: 400, title: '链接错误' },
    };
  }
};

export default OauthGithubRedirect;
