/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import jsCookie from 'js-cookie';

import Link from 'next/link';

import {
  Navbar as NavbarContainer,
  NavbarGroup,
  NavbarHeading,
  Alignment,
  AnchorButton,
  Divider,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Position,
  Button,
  Classes,
  // Icon,
} from '@yishanzhilubp/core';

import { GITHUB_OAUTH_URL, TOKEN_KEY } from '@/src/utils/constants';
import { useUserContext } from '@/src/scopes/global/userContext';
import { useRouter } from 'next/router';
import { removeToken } from '@/src/utils/auth';
import { f } from '@/src/api';
import { IUserProfile } from '@/src/model/schemas';

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

export const Navbar = () => {
  const {
    state: {
      isLogin,
      user: { avatarUrl },
    },
    dispatch,
  } = useUserContext();
  React.useEffect(() => {
    (async function tryLogin() {
      try {
        const token = jsCookie.get(TOKEN_KEY);
        if (token && !isLogin) {
          const { data: user } = await f.get<IUserProfile>('user');
          dispatch({ type: 'Login', user });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  return (
    <NavbarContainer>
      <NavbarGroup>
        <NavbarHeading>
          <div style={{ display: 'flex' }}>
            <Link href={isLogin ? '/workspace/dashboard' : '/'}>
              <a>
                <img
                  src="/static/layout/logo.png"
                  alt="logo"
                  style={{ width: 30, height: 30 }}
                />
              </a>
            </Link>
            {/*
            <div className="bp3-input-group search" style={{ marginLeft: 30 }}>
              <Icon icon="search" />
              <input className="bp3-input" placeholder="搜索移山" dir="auto" />
            </div> */}
          </div>
        </NavbarHeading>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        {isLogin ? (
          <Popover content={<ProfileMenu />} position={Position.BOTTOM_RIGHT}>
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
        ) : (
          <AnchorButton minimal intent="primary" href={GITHUB_OAUTH_URL}>
            内测用户登录
          </AnchorButton>
        )}
      </NavbarGroup>
      <style jsx>{`
        @media (max-width: 1024px) {
          .search {
            display: none;
          }
        }
      `}</style>
    </NavbarContainer>
  );
};

export function LandingLayout({ children }): React.ReactElement {
  return (
    <div>
      <Navbar />
      {children}
      <Divider />
      <footer
        style={{
          textAlign: 'center',
          margin: '10px',
          color: '#8c8c8c',
        }}
      >
        © {new Date().getFullYear()} Yishan Authors
      </footer>
    </div>
  );
}
