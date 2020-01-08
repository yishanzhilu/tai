/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { NextPageContext } from 'next';
import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import jsCookie from 'js-cookie';
import nextCookie from 'next-cookies';
import { IS_SERVER, SERVER_API_URL, API_URL, IS_BROWSER } from '../utils/env';
import { Toast } from '../utils/toaster';

const baseURL = IS_SERVER ? SERVER_API_URL : API_URL;

export const axios = Axios.create({
  baseURL,
  timeout: 10000,
});

axios.interceptors.request.use(
  (config): AxiosRequestConfig => {
    if (IS_BROWSER) {
      const token = jsCookie.get('everestToken');
      if (token) {
        config.headers.Authorization = token;
      }
    }
    return config;
  }
);

axios.interceptors.response.use(
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

export async function useServerRequest<Data>(
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
  const res = await axios.get<Data>(url, config);
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
  console.error(error);
  if (!error.response) {
    throw error;
  }
  const message =
    error.response.data.error ||
    praseHTTPErrorStatusText(error.response.status);
  if (toast) {
    Toast.show({ message, intent: 'warning' });
    sessionStorage.setItem(
      `err-${Date.now()}`,
      error.response ? JSON.stringify(error.response.data) : error.message
    );
  }
}
