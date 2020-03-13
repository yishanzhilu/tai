/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import * as React from 'react';

import { Toaster, Position, Classes } from '@yishanzhilubp/core';
import { IS_BROWSER } from './constants';

export const TaiToast = IS_BROWSER
  ? Toaster.create({
      className: 'my-toaster',
      position: Position.TOP,
    })
  : null;

export const TaiToastError = (msg: string, error?: Error) => {
  TaiToast.clear();
  TaiToast.show({
    icon: 'warning-sign',
    message: (
      <div style={{ textAlign: 'center' }}>
        {msg}
        <br />
        {error && (
          <div className={Classes.TEXT_SMALL}>错误: {error.message}</div>
        )}
      </div>
    ),
    intent: 'primary',
  });
};

export const TaiToastSuccess = (msg: string) => {
  TaiToast.clear();
  TaiToast.show({
    icon: 'tick',
    message: <div style={{ textAlign: 'center' }}>{msg}</div>,
    intent: 'success',
  });
};
