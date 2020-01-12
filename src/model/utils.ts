/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

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
}

export type ITheme = 'light' | 'dark';


