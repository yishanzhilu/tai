/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPageContext, NextPage } from 'next';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';

import TaiError from '@/pages/_error';
import { ITaiPageError, IPageProps } from '@/src/model/utils';
import { sf, HandleError, newTaiError } from '@/src/api';
import { IUserProfile, IWorkProfile } from '@/src/model/schemas';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
import { useUserContext } from '@/src/scopes/global/userContext';

import { TOKEN_KEY, IS_SERVER } from './constants';

/**
 * useGetInitialPropsGuard 用于在 getInitialProps 方法中守卫页面
 * 以保证只有有权限的用户才能访问此页面
 * 如果有 token，则请求用户信息并返回
 * 首先没有 token，或者 token 非法，则返回 403 报错
 */
async function useGetInitialPropsGuard(ctx: NextPageContext) {
  let user: IUserProfile = null;
  let work: IWorkProfile = { goals: [], missions: [] };
  let error: ITaiPageError = null;
  const cookies = nextCookie(ctx);
  const token = cookies[TOKEN_KEY];
  if (!token) {
    error = newTaiError('您尚未登录', 401, ctx.asPath);
  } else if (IS_SERVER) {
    try {
      [user, work] = await Promise.all([
        sf<IUserProfile>('user', {}, ctx),
        sf<IWorkProfile>('overview', {}, ctx),
      ]);
    } catch (err) {
      error = HandleError(err);
    }
  }
  return { error, user, work };
}

/**
 * withPageGuard 是用于 page 的 hoc，它会根据用户的 token/refresh-token
 * 判断用户的身份，如果用户没有合法身份，且 privatePage 为 true，则返回 403
 * 错误页面
 * @param WrappedPage
 * @param privatePage
 * @param publicRedirect 如果是 public 页面，同时已经登录，是否要重定向到 workspace
 */
export const withPageGuard = (WrappedPage: NextPage<IPageProps>) => {
  const Wrapper: NextPage<IPageProps> = props => {
    const { error, user, work } = props;
    if (error) {
      return (
        <TaiError code={error.code} message={error.message} url={error.url} />
      );
    }
    const { state, dispatch } = useUserContext();

    if (!state.isLogin && !user) {
      return <TaiError code={403} message="您无权访问该页面" />;
    }
    const { dispatch: dispatchWorkProfile } = useWorkProfileContext();
    React.useEffect(() => {
      if (!state.isLogin && user) {
        dispatch({ type: 'Login', user });
        dispatchWorkProfile({
          type: 'Init',
          goals: work.goals,
          missions: work.missions,
        });
      }
    }, [state.isLogin]);
    return <WrappedPage {...props} />;
  };

  Wrapper.getInitialProps = async (ctx: NextPageContext) => {
    const { error, user, work } = await useGetInitialPropsGuard(ctx);
    if (error) {
      return { user, work, error };
    }
    const componentProps =
      WrappedPage.getInitialProps && (await WrappedPage.getInitialProps(ctx));

    return { user, work, error, ...componentProps };
  };

  return Wrapper;
};

export const logout = (callback: () => void) => {
  localStorage.removeItem('taiUserID');
  localStorage.removeItem('taiRefreshToken');
  cookie.remove('x-tai-everest-fresh-token', {
    path: '/refresh-login',
  });
  cookie.remove('x-tai-everest-user-id', {
    path: '/refresh-login',
  });
  cookie.remove('x-tai-everest-token');
  callback();
};
