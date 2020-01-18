/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { Classes } from '@yishanzhilubp/core';

import { useGlobalContext } from '../contexts/global';
import { ITheme } from '../model/utils';

export function ThemeLayout({ children }): React.ReactElement {
  const [store, dispatch] = useGlobalContext();
  React.useEffect(() => {
    const storageTheme = localStorage.getItem('tai-theme');
    console.log('storageTheme', storageTheme);

    if (storageTheme !== store.theme) {
      dispatch({ type: 'SetTheme', newTheme: storageTheme as ITheme });
    }
  }, []);

  const isDarkTheme = store.theme === 'dark';
  return (
    <div
      className={isDarkTheme ? Classes.DARK : ''}
      style={{ background: isDarkTheme ? '#30404d' : '' }}
    >
      {children}
    </div>
  );
}
