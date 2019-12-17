/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { Classes } from '@yishanzhilu/blueprint-core';

import { IProps } from '@/src/model/utils';

import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { useGlobalContext } from '@/src/contexts/global';

export const TaiLayout = observer(({ children }: IProps) => {
  const [store, dispatch] = useGlobalContext();

  const handleToggleTheme = () =>
    dispatch({ type: 'SetTheme', newTheme: 'dark' });

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
          <article>
            <div className="article-inner">{children}</div>
            <div className="article-footer">
              © {new Date().getFullYear()} Yishan Authors
            </div>
          </article>
        </div>
      </div>

      <style jsx>{`
        #tai-app {
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
          margin-top: 50px;
        }
        header {
          position: fixed;
          width: 100%;
          z-index: 10;
          top: 0;
        }
        aside {
          flex-grow: 0;
          flex-shrink: 0;
          position: fixed;
          z-index: 9;
          width: 300px;
          height: calc(100vh - 50px);
        }
        article {
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          flex-direction: column;
          width: calc(100vw - 283px);
          padding-left: 400px;
          padding-right: 100px;
        }
        .article-inner {
          max-width: 1000px;
          min-height: calc(100vh - 105px);
        }
        .article-footer {
          margin: 32px 0;
          color: #6a737d;
        }
      `}</style>
    </div>
  );
});
