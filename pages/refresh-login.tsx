/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';
import nextCookie from 'next-cookies';
import { f, HandleError } from '@/src/api';
import { parseJWT } from '@/src/model/utils';
import { redirect } from '@/src/utils/funcs';
import {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_ID_KEY,
} from '@/src/utils/constants';

/**
 * RefreshLogin 用于使用 refresh-token 获取 token。
 * 主要的场景是 token 已经过期的 ssr 首页渲染。
 * 方法是重定向用户于此并使用保存在这里的 refresh token cookie
 * 来获取 token。
 * 如果 refresh token 也过期了，或被覆盖了，则返回用户请求
 * 的地址，并使用 refresh-login-fail=true 的 query
 * 告知用户refresh token 已经失效，不要再继续尝试使用
 * refresh token 登录。
 * 相关文件请参考 src/utils/pageGuard.tsx
 */
const RefreshLogin: NextPage = (): React.ReactElement => {
  return <div>RefreshLogin</div>;
};

RefreshLogin.getInitialProps = async ctx => {
  const redirectFrom = ctx.query['redirect-from'] || '/';
  try {
    const cookies = nextCookie(ctx);
    const refreshToken = cookies[REFRESH_TOKEN_KEY];
    const userID = Number(cookies[USER_ID_KEY]);
    if (!refreshToken || userID === 0) {
      redirect(`${redirectFrom}`, ctx, false, false, {
        'refresh-login-fail': 'true',
      });
      return;
    }
    const res = await f.post<{ token: string }>('/user/token', {
      userID,
      refreshToken,
    });
    const { exp } = parseJWT(res.data.token);
    ctx.res.writeHead(302, {
      Location: redirectFrom,
      'Set-Cookie': [
        `${TOKEN_KEY}=Bearer ${res.data.token};Expires=${new Date(
          exp * 1000
        ).toUTCString()}`,
      ],
    });
    ctx.res.end();
  } catch (error) {
    const { code, message } = HandleError(error);
    console.log('/refresh-token', { code, message });
    redirect(redirectFrom as string, ctx, true, false, {
      'refresh-login-fail': 'true',
    });
  }
};

export default RefreshLogin;
