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
} from '../utils/env';
import { Toast } from '../utils/toaster';
import {  TOKEN_KEY } from '../utils/constants';

const baseURL = IS_SERVER ? SERVER_API_URL : API_URL;

export const f = Axios.create({
  baseURL,
  timeout: 10000,
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
  (error: AxiosError): Promise<never> => {
    if (IS_SERVER) {
      if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error('Error', error.message);
      }
    }
    return Promise.reject(error);
  }
);

export async function sf<Data>(
  url: string,
  config: AxiosRequestConfig,
  context: NextPageContext
): Promise<Data> {
  const { everestToken: token } = nextCookie(context);

  if (IS_SERVER) {
    config.headers = {
      Authorization: token,
    };
  }
  const res = await f.get<Data>(url, config);
  return res.data;
}

const praseHTTPErrorStatusText = (status: number): string => {
  if (status >= 500) {
    return '服务器错误，请稍后重试';
  }
  if (status >= 400) {
    return '客户端请求异常，请发送正确的请求';
  }
  throw Error('请求未出错，但被要求进行错误处理');
};

export function HandleError(error: AxiosError, toast = true) {
  if (!error.response) {
    throw error;
  }
  const message =
    error.response.data.error ||
    praseHTTPErrorStatusText(error.response.status);
  if (toast && IS_BROWSER) {
    Toast.show({ message, intent: 'warning' });
    sessionStorage.setItem(
      `err-${Date.now()}`,
      error.response ? JSON.stringify(error.response.data) : error.message
    );
  }
  return { code: error.response.status, message };
}
