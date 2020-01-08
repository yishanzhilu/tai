/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import {
  Button,
  Classes,
  Navbar as NavbarContainer,
  NavbarGroup,
  NavbarHeading,
  Alignment,
  Icon,
  Switch,
  NavbarDivider,
  Position,
  Popover,
  Menu,
  MenuItem,
} from '@yishanzhilubp/core';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useGlobalContext } from '@/src/contexts/global';

const CreateMenu: React.FC = () => {
  return (
    <Menu>
      <MenuItem icon={<span>🎯</span>} text="设立目标" />
      <MenuItem icon={<span>📜</span>} text="创建任务" />
      <MenuItem icon={<span>🎬</span>} text="添加记录" />
      <MenuItem icon={<span>✔️</span>} text="新增代办" />
    </Menu>
  );
};

const ProfileMenu: React.FC = () => {
  const router = useRouter();
  const [, dispatch] = useGlobalContext();
  return (
    <Menu>
      <MenuItem
        icon="log-out"
        text="退出"
        onClick={() => {
          localStorage.removeItem('refreshToken');
          cookie.remove('token');
          router.replace('/').then(() => window.scrollTo(0, 0));
          dispatch({ type: 'LogOut' });
        }}
      />
    </Menu>
  );
};

export const Navbar = () => {
  const [store, dispatch] = useGlobalContext();

  const handleToggleTheme = () =>
    dispatch({ type: 'SetTheme', newTheme: 'dark' });

  const isDarkTheme = store.theme === 'dark';
  return (
    <NavbarContainer>
      <NavbarGroup>
        <NavbarHeading>
          <img
            src="/static/layout/logo.png"
            alt="logo"
            style={{ width: 30, height: 30 }}
          />
        </NavbarHeading>
        <div className="bp3-input-group">
          <Icon icon="search" />
          <input className="bp3-input" placeholder="搜索移山" dir="auto" />
        </div>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Switch
          checked={isDarkTheme}
          label="Dark Mode"
          alignIndicator={Alignment.RIGHT}
          onChange={handleToggleTheme}
          style={{ marginBottom: 0 }}
        />
        <NavbarDivider />
        <Popover content={<CreateMenu />} position={Position.BOTTOM_RIGHT}>
          <Button className={Classes.MINIMAL} icon="add" />
        </Popover>
        <Popover content={<ProfileMenu />} position={Position.BOTTOM_RIGHT}>
          <Button className={Classes.MINIMAL} icon="cog" />
        </Popover>
      </NavbarGroup>
    </NavbarContainer>
  );
};
