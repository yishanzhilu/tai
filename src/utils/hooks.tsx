/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import nextCookie from 'next-cookies';
import { NextPageContext } from 'next';
import { ITaiPageError } from '../model/utils';

/**
 * useInputRef 用于生成回调模式的 input 或者 textarea 的 ref
 *
 * https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
 *
 *
 */
export function useInputRef<T extends { value: string }>(): [
  T,
  (node: T) => void
] {
  const [input, setValue] = React.useState(null);
  const ref = React.useCallback((node: T) => {
    if (node !== null) {
      setValue(node);
    }
  }, []);
  return [input, ref];
}

/**
 * useGetInitialPropsGuard 用于在 getInitialProps 方法中守卫页面
 * 以保证只有有权限的用户才能访问此页面
 * 首先判断用户是否有 token，如果没有则转入 403 页面
 */
export function useGetInitialPropsGuard(ctx: NextPageContext) {
  const { token } = nextCookie(ctx);
  let error: ITaiPageError = null;
  if (!token) {
    error = { statusCode: 403, title: '您无权访问该页面' };
  }
  return { token, error };
}
