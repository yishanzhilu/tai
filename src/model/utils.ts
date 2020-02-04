/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { IUserProfile, IWorkProfile } from './schemas';
import { base64ToString } from '../utils/encoding';

export interface IProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ITaiPageError {
  code: number;
  message: string;
}

export interface IPageProps {
  error?: ITaiPageError;
  user?: IUserProfile;
  work?: IWorkProfile;
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
