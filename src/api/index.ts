/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { NextPageContext } from 'next';
import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import jsCookie from 'js-cookie';
import nextCookie from 'next-cookies';
import { IS_SERVER, SERVER_API_URL, API_URL, IS_BROWSER } from '../utils';

const baseURL = IS_SERVER ? SERVER_API_URL : API_URL;

export const axios = Axios.create({
  baseURL,
  timeout: 5000,
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
