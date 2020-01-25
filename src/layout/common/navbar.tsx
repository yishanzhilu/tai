/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';

import {
  Button,
  Classes,
  Navbar as NavbarContainer,
  NavbarGroup,
  NavbarHeading,
  Alignment,
  Icon,
  Position,
  Popover,
  Menu,
  MenuItem,
  AnchorButton,
  MenuDivider,
} from '@yishanzhilubp/core';

import { useGlobalContext } from '@/src/contexts/global';
import { GITHUB_OAUTH_URL } from '@/src/utils/constants';

const CreateMenu: React.FC = () => {
  return (
    <Menu>
      <MenuItem icon={<span>🎯</span>} text="设立目标" />
      <MenuItem icon={<span>📜</span>} text="创建任务" />
      <MenuItem icon={<span>✔️</span>} text="添加事项" />
      <MenuItem icon={<span>📝</span>} text="记录历程" />
    </Menu>
  );
};

const ProfileMenu: React.FC = () => {
  const router = useRouter();
  const [, dispatch] = useGlobalContext();
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
            qy
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
        onClick={() => {
          localStorage.removeItem('taiUserID');
          localStorage.removeItem('taiRefreshToken');
          cookie.remove('x-tai-everest-fresh-token', {
            path: '/refresh-login',
          });
          cookie.remove('x-tai-everest-user-id', {
            path: '/refresh-login',
          });
          cookie.remove('x-tai-everest-token');
          router.replace('/').then(() => window.scrollTo(0, 0));
          dispatch({ type: 'LogOut' });
        }}
      />
    </Menu>
  );
};

export const Navbar = () => {
  const [store] = useGlobalContext();

  return (
    <NavbarContainer>
      <NavbarGroup>
        <NavbarHeading>
          <Link href={store.isLogin ? '/workspace/dashboard' : '/'}>
            <a>
              <img
                src="/static/layout/logo.png"
                alt="logo"
                style={{ width: 30, height: 30 }}
              />
            </a>
          </Link>
        </NavbarHeading>
        <div className="bp3-input-group">
          <Icon icon="search" />
          <input className="bp3-input" placeholder="搜索移山" dir="auto" />
        </div>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        {store.isLogin ? (
          <>
            {/* <Switch
              checked={isDarkTheme}
              label="深色模式"
              alignIndicator={Alignment.RIGHT}
              onChange={handleToggleTheme}
              style={{ marginBottom: 0 }}
            />
            <NavbarDivider /> */}
            <Popover content={<CreateMenu />} position={Position.BOTTOM_RIGHT}>
              <Button className={Classes.MINIMAL} icon="add" />
            </Popover>
            <Popover content={<ProfileMenu />} position={Position.BOTTOM_RIGHT}>
              <Button
                className={Classes.MINIMAL}
                rightIcon="caret-down"
                icon={
                  <img
                    src={store.user.avatarUrl}
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
  );
};
