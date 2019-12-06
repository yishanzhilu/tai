/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import useSWR, { ConfigInterface } from 'swr';
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
    if (!IS_SERVER) {
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
  (error): Promise<never> => {
    return Promise.reject(error);
  }
);

export async function getInitialState(token: string) {
  const res = await Promise.all([
    axios.get('/users/me', {
      headers: {
        Authorization: token,
      },
    }),
    axios.get('/workspace/overview', {
      headers: {
        Authorization: token,
      },
    }),
  ]);
  return {
    user: res[0].data,
    works: res[1].data,
  };
}

export function useRequest<Data, Error>(
  key: string,
  axiosConfig: AxiosRequestConfig,
  swrConfig: ConfigInterface
) {
  const { initialData, ...config } = swrConfig;
  const { data: response, error, isValidating, revalidate } = useSWR<
    AxiosResponse<Data>,
    AxiosError<Error>
  >(key, () => axios.get<Data>(key, axiosConfig), {
    ...config,
    initialData: initialData && {
      status: 200,
      statusText: 'InitialData',
      headers: {},
      data: initialData,
      config: {},
    },
  });

  return {
    data: response && response.data,
    response,
    error,
    isValidating,
    revalidate,
  };
}

export async function useServerRequest<Data>(
  url: string,
  context: NextPageContext
): Promise<Data> {
  if (IS_BROWSER) {
    const res = await axios.get<Data>(url);
    return res.data;
  }
  const { everestToken: token } = nextCookie(context);
  const res = await axios.get<Data>(url, {
    headers: {
      Authorization: token,
    },
  });
  return res.data;
}
