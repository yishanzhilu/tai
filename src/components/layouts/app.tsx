/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { Button } from '@yishanzhilubp/core';

import { Navbar } from './navbar';

interface IProps {
  content: React.ReactNode;
  sidebar: React.ReactNode;
}

export const AppLayout = ({ content, sidebar }: IProps) => {
  const [showAside, setShowAside] = React.useState(false);
  return (
    <div id="tai-app">
      <div className="tai-app-inner">
        <header>
          <Navbar />
        </header>
        <div className="main">
          <aside className={showAside ? 'on' : 'off'}>
            {sidebar}
            <div className="handler">
              <Button
                intent="primary"
                icon={showAside ? 'arrow-left' : 'arrow-right'}
                onClick={() => {
                  setShowAside(s => !s);
                }}
              />
            </div>
          </aside>
          <article>
            <div className="article-inner">{content}</div>
            <div className="article-footer">
              © {new Date().getFullYear()} Yishan Authors
            </div>
          </article>
        </div>
      </div>

      {/* Todo: width: calc(100vw - 17px) so overlay won't resize in windows
          need further test on mac os and linux
      */}
      <style jsx>{`
        #tai-app {
          overflow: hidden;
          // width: calc(100vw - 17px);
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
          // width: calc(100vw - 17px);
          z-index: 10;
          top: 0;
          left: 0;
          right: 0;
        }
        aside {
          flex-grow: 0;
          flex-shrink: 0;
          position: fixed;
          z-index: 9;
          width: 300px;
          background: #ffffff;
          height: calc(100vh - 50px);
          transition: left 0.5s ease;
        }
        @media (max-width: 1440px) {
          aside {
            width: 250px;
          }
        }
        @media (max-width: 1024px) {
          aside {
            left: -250px;
          }
        }
        aside.on {
          left: 0;
        }
        .handler {
          position: absolute;
          z-index: 9;
          bottom: 30px;
          right: -30px;
          display: none;
        }
        @media (max-width: 1024px) {
          .handler {
            display: block;
          }
        }
        article {
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          flex-direction: column;
          margin: 0 auto;
          max-width: 960px;
          width: 100vw;
          padding: 20px;
        }
        @media (max-width: 1550px) {
          article {
            margin-left: 400px;
          }
        }
        @media (max-width: 1440px) {
          article {
            margin-left: 300px;
          }
        }
        @media (max-width: 1024px) {
          article {
            margin-left: auto;
          }
        }

        .article-inner {
          width: 100%;
          max-width: 1000px;
          min-height: calc(100vh - 150px);
          margin: 0 auto;
        }
        .article-footer {
          margin: 32px 0;
          color: #6a737d;
        }
      `}</style>
    </div>
  );
};
