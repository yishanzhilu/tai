/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Button,
  Classes,
  Navbar as NavbarContainer,
  NavbarGroup,
  Position,
  Popover,
  Menu,
  MenuItem,
  AnchorButton,
  MenuDivider,
  // Icon,
} from '@yishanzhilubp/core';

import { GITHUB_OAUTH_URL } from '@/src/utils/constants';
import { removeToken } from '@/src/utils/auth';
import { useUserContext } from '@/src/scopes/global/userContext';

const ProfileMenu: React.FC = () => {
  const router = useRouter();
  const {
    dispatch,
    state: {
      user: { name },
    },
  } = useUserContext();
  return (
    <Menu>
      <MenuDivider
        title={
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 10,
              marginTop: 5,
            }}
          >
            {name || '您好'}
          </div>
        }
      />
      <MenuDivider />
      {/* <Link href="/settings/profile" passHref>
        <MenuItem icon="settings" text="设置" />
      </Link> */}
      <MenuItem
        icon="log-out"
        text="退出"
        onClick={async () => {
          removeToken();
          dispatch({ type: 'LogOut' });
          await router.replace('/');
          window.scrollTo(0, 0);
        }}
      />
    </Menu>
  );
};

interface IProps {
  content: React.ReactNode;
  sidebar: React.ReactNode;
}

export const AppLayout = ({ content, sidebar }: IProps) => {
  const {
    state: {
      isLogin,
      user: { avatarUrl },
    },
  } = useUserContext();
  const [showAside, setShowAside] = React.useState(false);
  React.useEffect(() => {
    if (showAside) {
      document.body.classList.add(Classes.OVERLAY_OPEN);
    } else {
      document.body.classList.remove(Classes.OVERLAY_OPEN);
    }
  }, [showAside]);
  return (
    <div id="tai-app">
      <div className="tai-app-inner">
        <header>
          <NavbarContainer>
            <NavbarGroup
              align="center"
              style={{ justifyContent: 'space-between' }}
            >
              <span className="handler">
                <Button
                  minimal
                  icon="menu"
                  onClick={() => {
                    setShowAside(true);
                  }}
                />
              </span>
              <div style={{ display: 'flex' }}>
                <Link href={isLogin ? '/workspace/dashboard' : '/'}>
                  <a className="logo">
                    <img
                      src="/static/layout/logo.png"
                      alt="logo"
                      style={{ width: 30, height: 30 }}
                    />
                  </a>
                </Link>

                {/* <div
                  className="bp3-input-group search"
                  style={{ marginLeft: 30 }}
                >
                  <Icon icon="search" />
                  <input
                    className="bp3-input"
                    placeholder="搜索移山"
                    dir="auto"
                  />
                </div> */}
              </div>
              {isLogin ? (
                <>
                  <Popover
                    content={<ProfileMenu />}
                    position={Position.BOTTOM_RIGHT}
                  >
                    <Button
                      className={Classes.MINIMAL}
                      rightIcon="caret-down"
                      icon={
                        <img
                          src={avatarUrl}
                          style={{ width: 20, height: 20, borderRadius: 4 }}
                        />
                      }
                    />
                  </Popover>
                </>
              ) : (
                <AnchorButton minimal intent="primary" href={GITHUB_OAUTH_URL}>
                  内测用户登录
                </AnchorButton>
              )}
            </NavbarGroup>
          </NavbarContainer>
        </header>
        <div className="main">
          <aside className={showAside ? 'on' : 'off'}>
            {sidebar}
            <div className="backdrop" onClick={() => setShowAside(false)} />
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
          top: 50px;
          height: calc(100vh - 50px);
          transition: left 0.5s ease;
        }
        aside .backdrop {
          display: none;
          position: fixed;
          z-index: -1;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          opacity: 0.6;
        }
        @media (max-width: 1440px) {
          aside {
            width: 250px;
          }
        }
        @media (max-width: 1024px) {
          aside {
            left: -81vw;
            width: 80vw;
            height: 100vh;
            z-index: 11;
            top: 0;
          }
        }
        aside.on {
          left: 0;
        }
        aside.on .backdrop {
          display: block;
        }
        .handler {
          display: none;
          -webkit-tap-highlight-color: transparent;
        }
        @media (max-width: 1024px) {
          .handler {
            width: 63px;
            display: inline-block;
          }
          .search {
            display: none;
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
