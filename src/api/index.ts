/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import Axios from 'axios';
import { IS_SERVER, SERVER_API_URL, API_URL } from '../utils';

const baseURL = IS_SERVER ? SERVER_API_URL : API_URL;

export const axios = Axios.create({
  baseURL,
  timeout: 5000,
});

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
