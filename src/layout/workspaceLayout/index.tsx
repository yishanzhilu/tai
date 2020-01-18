/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import Head from 'next/head';


import { IProps } from '@/src/model/utils';

import { Navbar } from '../common/navbar';
import { WorkSpaceSidebar } from './workspaceSidebar';
import { ThemeLayout } from '../themeLayout';

export const WorkspaceLayout = ({ children }: IProps) => {

  return (
    <ThemeLayout>
      <div id="tai-app">
        <Head>
          <title>工作台 · 移山</title>
        </Head>
        <div className="tai-app-inner">
          <header>
            <Navbar />
          </header>
          <div className="main">
            <aside>
              <WorkSpaceSidebar />
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
          @media (max-width: 1200px) {
            aside {
              width: 250px;
            }
          }
          article {
            flex-grow: 1;
            flex-shrink: 1;
            display: flex;
            flex-direction: column;
            padding-left: 400px;
            padding-right: 400px;
            padding-top: 20px;
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
    </ThemeLayout>
  );
};
