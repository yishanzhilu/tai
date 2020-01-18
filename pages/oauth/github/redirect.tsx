/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';
import { Spinner, Classes } from '@yishanzhilubp/core';
import cookie from 'js-cookie';

import { axios, HandleError } from '@/src/api';
import { LandingLayout } from '@/src/layout';
import { Flex } from '@/src/components/flex';
import { parseJWT, IPageProps } from '@/src/model/utils';
import TaiError from '@/pages/_error';
import { redirect } from '@/src/utils/funcs';
import {
  REFRESH_TOKEN_EXPIRE_DAYS,
  REFRESH_TOKEN_KEY,
  USER_ID_KEY,
  TOKEN_KEY,
} from '@/src/utils/constants';

interface IProps extends IPageProps {
  token?: string;
  refreshToken?: string;
}

const OauthGithubRedirect: NextPage<IProps> = ({
  token,
  refreshToken,
  error,
}) => {
  React.useEffect(() => {
    console.debug('OauthGithubRedirect useEffect, error:', error);
    if (token && refreshToken) {
      const { exp, userID } = parseJWT(token);
      cookie.set(TOKEN_KEY, `Bearer ${token}`, {
        expires: new Date(exp * 1000),
      });

      // add refresh-token and user id to cookie
      // with path /refresh-login for refresh login
      cookie.set(REFRESH_TOKEN_KEY, refreshToken, {
        expires: REFRESH_TOKEN_EXPIRE_DAYS,
        path: '/refresh-login',
      });

      cookie.set(USER_ID_KEY, userID, {
        expires: REFRESH_TOKEN_EXPIRE_DAYS,
        path: '/refresh-login',
      });

      // add refresh-token and user id to localStorage
      // for axios to refresh token
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_ID_KEY, userID);

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
      const oauthResp = await axios.get<{
        token: string;
        refreshToken: string;
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
