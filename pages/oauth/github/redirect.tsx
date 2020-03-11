/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';
import { Spinner, Classes } from '@yishanzhilubp/core';
import cookie from 'js-cookie';

import { f, HandleError, newTaiError } from '@/src/api';
import { LandingLayout } from '@/src/components/layouts/landing';
import { Flex } from '@/src/components/flex';
import { IPageProps } from '@/src/model/utils';
import TaiError from '@/pages/_error';
import { TOKEN_KEY } from '@/src/utils/constants';

interface IProps extends IPageProps {
  token?: string;
}

const OauthGithubRedirect: NextPage<IProps> = ({ token, error }) => {
  React.useEffect(() => {
    if (token) {
      cookie.set(TOKEN_KEY, `Bearer ${token}`, {
        expires: 365,
        sameSite: 'strict',
      });
      window.location.replace('/workspace/dashboard');
    }
  }, [token]);
  if (error) {
    return <TaiError code={error.code} message={error.message} />;
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
  if (code) {
    try {
      const { data } = await f.get<{
        token: string;
      }>('/user/oauth/github', {
        params: { code },
      });
      return data;
    } catch (err) {
      const error = HandleError(err);
      return {
        error,
      };
    }
  } else {
    return {
      error: newTaiError('链接错误', 400, ''),
    };
  }
};

export default OauthGithubRedirect;
