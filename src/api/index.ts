/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { NextPageContext } from 'next';
import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import jsCookie from 'js-cookie';
import nextCookie from 'next-cookies';
import {
  IS_SERVER,
  SERVER_API_URL,
  API_URL,
  IS_BROWSER,
  VERSION,
  TOKEN_KEY,
} from '../utils/constants';
import { TaiToast } from '../utils/toaster';
import { ITaiPageError } from '../model/utils';

const praseHTTPErrorStatusText = (status: number): string => {
  if (status >= 500) {
    return '服务器错误，请稍后重试';
  }
  if (status >= 400) {
    return '客户端请求异常，请发送正确的请求';
  }
  throw Error('请求未出错，但被要求进行错误处理');
};

export function HandleError(error: AxiosError, toast = true): ITaiPageError {
  if (!error.response) {
    throw error;
  }
  const message =
    error.response.data || praseHTTPErrorStatusText(error.response.status);
  if (toast && IS_BROWSER) {
    TaiToast.show({ message, intent: 'warning' });
  }
  return { code: error.response.status, message, url: error.config.url };
}
const baseURL = IS_SERVER ? SERVER_API_URL : API_URL;

export const f = Axios.create({
  baseURL,
  timeout: 3000,
});

f.interceptors.request.use(async config => {
  if (IS_BROWSER) {
    if (config.headers.skipToken) {
      delete config.headers.skipToken;
      return config;
    }
    const token = jsCookie.get(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = token;
    }
  } else if (IS_SERVER) {
    config.headers['User-Agent'] = `tai ${VERSION}`;
  }
  return config;
});

f.interceptors.response.use(
  (response): AxiosResponse => {
    return response;
  },
  (error: AxiosError) => {
    if (IS_SERVER) {
      console.error(
        'f interceptors on error:',
        error.message,
        error.config.url
      );
    }
    throw HandleError(error);
  }
);

export async function sf<Data>(
  url: string,
  config: AxiosRequestConfig,
  context: NextPageContext
): Promise<Data> {
  const { 'x-tai-everest-token': token } = nextCookie(context);
  if (IS_SERVER) {
    if (token) {
      config.headers = {
        Authorization: token,
      };
    }
  }
  const res = await f.get<Data>(url, config);
  return res.data;
}
