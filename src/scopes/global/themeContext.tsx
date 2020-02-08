/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { Classes } from '@yishanzhilubp/core';

import { ITheme } from '@/src/model/utils';
import { noop } from '@/src/utils/funcs';

const ThemeContext = React.createContext<{
  theme: ITheme;
  setTheme: React.Dispatch<React.SetStateAction<ITheme>>;
}>({ theme: 'light', setTheme: noop });

export const useThemeContext = () => React.useContext(ThemeContext);

export const ThemeContextPorvider: React.FC = ({ children }) => {
  const [theme, setTheme] = React.useState<ITheme>('light');
  const isDarkTheme = theme === 'dark';
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={isDarkTheme ? Classes.DARK : ''}
        style={{ background: isDarkTheme ? '#30404d' : null }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
