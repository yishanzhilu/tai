/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { IUserProfile } from './schemas';
import { base64ToString } from '../utils/encoding';

export interface IProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ITaiPageError {
  statusCode: number;
  title: string;
}

export interface IPageProps {
  error?: ITaiPageError;
  initUser?: IUserProfile;
}

export interface IToken {
  userID: string;
  exp: number;
  iss: string;
}

export const parseJWT = (token: string): IToken => {
  console.debug('parseJWT', token);
  try {
    const info64 = token.split('.')[1];
    return JSON.parse(base64ToString(info64));
  } catch (e) {
    console.debug('parseJWT', e);

    return null;
  }
};

export type ITheme = 'light' | 'dark';
