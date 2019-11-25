/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { Classes } from '@yishanzhilu/blueprint-core';

import { IProps } from '@/src/types/utils';

import { Navbar } from './navbar';
import { useGlobalStore } from '../../store/global';
import { Sidebar } from './sidebar';

export const TaiLayout = observer(({ children }: IProps) => {
  const store = useGlobalStore();

  const handleToggleTheme = () => store.toggleTheme();

  const isDarkTheme = store.theme === 'dark';
  const mainClass = classnames(isDarkTheme && Classes.DARK);
  return (
    <div className={mainClass} id="tai-app">
      <div className="tai-app-inner">
        <header>
          <Navbar
            handleToggleTheme={handleToggleTheme}
            isDarkTheme={isDarkTheme}
          />
        </header>
        <div className="main">
          <aside>
            <Sidebar />
          </aside>
          <article>{children}</article>
        </div>
      </div>

      <style jsx>{`
        #tai-app {
          height: 100vh;
          overflow: hidden;
          position: relative;
        }
        #tai-app.${Classes.DARK} {
          background: #30404d;
        }
        .tai-app-inner {
          height: 100%;
        }
        .main {
          display: flex;
        }
        aside {
          flex-grow: 0;
          flex-shrink: 0;
          position: relative;
          z-index: 9;
          width: 283px;
        }
        article {
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          flex-direction: column;
          z-index: 1;
          width: calc(100vw - 283px);
          max-width: 1000px;
          height: 100vh;
          max-height: 100%;
          padding-left: 100px;
          padding-top: 10px;
        }
      `}</style>
    </div>
  );
});
