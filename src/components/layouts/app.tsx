/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { Navbar } from './navbar';

interface IProps {
  content: React.ReactNode;
  sidebar: React.ReactNode;
}

export const AppLayout = ({ content, sidebar }: IProps) => {
  return (
    <div id="tai-app">
      <div className="tai-app-inner">
        <header>
          <Navbar />
        </header>
        <div className="main">
          <aside>{sidebar}</aside>
          <article>
            <div className="article-inner">{content}</div>
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
        @media (max-width: 1440px) {
          aside {
            width: 250px;
          }
        }
        article {
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          flex-direction: column;
          padding: 40px 400px 0;
        }
        @media (max-width: 1550px) {
          article {
            padding: 40px 200px 0 400px;
          }
        }
        @media (max-width: 1440px) {
          article {
            padding: 40px 100px 0 300px;
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
