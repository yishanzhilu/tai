/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';
import { Spinner, Classes } from '@yishanzhilubp/core';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';

import { axios } from '@/src/api';
import { IS_BROWSER } from '@/src/utils/env';
import { LandingLayout } from '@/src/layout';
import { Flex } from '@/src/components/flex';
import { Toast } from '@/src/utils/toaster';
import { redirect } from '@/src/utils/funcs';
import { useGlobalContext } from '@/src/contexts/global';

interface IJWT {
  userID: string;
  exp: number;
  iss: string;
}

const parseJWT = (token: string): IJWT => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const oauthGithub = async (code: string) => {
  try {
    const res = await axios.get<{ token: string; refreshToken: string }>(
      '/user/oauth/github',
      {
        params: { code },
      }
    );
    console.debug(res.data);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    const { exp } = parseJWT(res.data.token);
    cookie.set('token', res.data.token, {
      expires: new Date(exp * 1000),
    });
  } catch (err) {
    Toast.show({ message: err.message, intent: 'warning' });
    console.log(err.response);

    sessionStorage.setItem(
      `err-${Date.now()}`,
      err.response ? JSON.stringify(err.response.data) : err
    );
    redirect('/');
  }
};

const OauthGithubRedirect: NextPage = () => {
  const {
    query: { code },
  } = useRouter();
  const [_, dispatchGlobalAction] = useGlobalContext();
  React.useEffect(() => {
    console.log('OauthGithubRedirect useEffect, code:', code);

    if (IS_BROWSER && code) {
      oauthGithub(code as string).then(() => {
        dispatchGlobalAction({ type: 'Login' });
        redirect('/workspace/dashboard');
      });
    }
  }, [code]);
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
          <p className={Classes.TEXT_LARGE}>重定向中</p>
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

export default OauthGithubRedirect;
