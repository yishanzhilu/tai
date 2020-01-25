/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPageContext, NextPage } from 'next';
import nextCookie from 'next-cookies';
import { AxiosError } from 'axios';

import { ITaiPageError, IPageProps } from '../model/utils';
import TaiError from '@/pages/_error';
import { f } from '../api';
import { IUserProfile } from '../model/schemas';
import { redirect } from './funcs';
import { useGlobalContext } from '../contexts/global';
import { IS_BROWSER } from './env';
import { TOKEN_KEY } from './constants';

/**
 * useGetInitialPropsGuard 用于在 getInitialProps 方法中守卫页面
 * 以保证只有有权限的用户才能访问此页面
 * 如果有 token，则请求用户信息并返回
 * 首先没有 token，或者 token 非法，则返回 403 报错
 */
async function useGetInitialPropsGuard(ctx: NextPageContext) {
  let user: IUserProfile = null;
  let error: ITaiPageError = null;
  const cookies = nextCookie(ctx);
  const token = cookies[TOKEN_KEY];
  if (IS_BROWSER) {
    return { token, error, user };
  }
  if (!token) {
    error = { statusCode: 403, title: '您尚未登录' };
  } else {
    try {
      const resp = await f.get<IUserProfile>('user', {
        headers: {
          Authorization: token,
        },
      });
      user = resp.data;
    } catch (err) {
      const resErr = err as AxiosError;
      error = { statusCode: Number(resErr.code), title: resErr.message };
    }
  }
  return { token, error, user };
}

/**
 * withPageGuard 是用于 page 的 hoc，它会根据用户的 token/refresh-token
 * 判断用户的身份，如果用户没有合法身份，且 privatePage 为 true，则返回 403
 * 错误页面
 * @param WrappedPage
 * @param privatePage
 * @param publicRedirect 如果是 public 页面，同时已经登录，是否要重定向到 workspace
 */
export const withPageGuard = (
  WrappedPage: NextPage<IPageProps>,
  privatePage = false,
  privateRedirect = true
) => {
  const Wrapper: NextPage<IPageProps> = props => {
    const [state, dispatch] = useGlobalContext();
    const { error, initUser } = props;
    React.useEffect(() => {
      if (!state.isLogin && initUser) {
        dispatch({ type: 'Login', user: initUser });
      }
    }, [state.isLogin]);
    if (privatePage) {
      if (error) {
        return <TaiError statusCode={error.statusCode} title={error.title} />;
      }
      if (!state.isLogin && !initUser) {
        return <TaiError statusCode={403} title="您无权访问该页面" />;
      }
    }
    return <WrappedPage {...props} />;
  };

  Wrapper.getInitialProps = async (ctx: NextPageContext) => {
    let error = null;
    let user = null;
    const guardReport = await useGetInitialPropsGuard(ctx);
    error = guardReport.error;
    user = guardReport.user;
    if (!privatePage && privateRedirect && !error) {
      redirect('/workspace/dashboard', ctx);
      return {};
    }
    const componentProps =
      WrappedPage.getInitialProps && (await WrappedPage.getInitialProps(ctx));

    return { ...componentProps, initUser: user, error };
  };

  return Wrapper;
};
