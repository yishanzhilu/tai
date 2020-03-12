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
  NavbarHeading,
  Alignment,
  Position,
  Popover,
  Menu,
  MenuItem,
  AnchorButton,
  MenuDivider,
  // Icon,
} from '@yishanzhilubp/core';

// import { useTopBarContext } from '@/src/scopes/global/topBarContext';
import { GITHUB_OAUTH_URL } from '@/src/utils/constants';
import { logout } from '@/src/utils/auth';
import { useUserContext } from '@/src/scopes/global/userContext';

// const CreateMenu: React.FC = () => {
//   const { dispatch } = useTopBarContext();
//   return (
//     <Menu>
//       <MenuItem
//         icon={<span>🎯</span>}
//         text="设立目标"
//         onClick={() => dispatch({ type: 'SetNewGoalDialog', isOpen: true })}
//       />
//       <MenuItem
//         icon={<span>📌</span>}
//         text="创建任务"
//       onClick={() => dispatch({ type: 'SetNewMissionDialog', isOpen: true })}
//       />
//     </Menu>
//   );
// };

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
        onClick={() => {
          logout(async () => {
            await router.replace('/');
            window.scrollTo(0, 0);
            dispatch({ type: 'LogOut' });
          });
        }}
      />
    </Menu>
  );
};

export const Navbar = () => {
  const { state } = useUserContext();

  return (
    <NavbarContainer>
      <NavbarGroup>
        <NavbarHeading>
          <Link href={state.isLogin ? '/workspace/dashboard' : '/'}>
            <a>
              <img
                src="/static/layout/logo.png"
                alt="logo"
                style={{ width: 30, height: 30 }}
              />
            </a>
          </Link>
        </NavbarHeading>
        {/* <div className="bp3-input-group">
          <Icon icon="search" />
          <input className="bp3-input" placeholder="搜索移山" dir="auto" />
        </div> */}
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        {state.isLogin ? (
          <>
            {/* <Switch
              checked={isDarkTheme}
              label="深色模式"
              alignIndicator={Alignment.RIGHT}
              onChange={handleToggleTheme}
              style={{ marginBottom: 0 }}
            />
            <NavbarDivider /> */}
            {/*
            <Popover content={<CreateMenu />} position={Position.BOTTOM_RIGHT}>
              <Button className={Classes.MINIMAL} icon="add" />
            </Popover> */}
            <Popover content={<ProfileMenu />} position={Position.BOTTOM_RIGHT}>
              <Button
                className={Classes.MINIMAL}
                rightIcon="caret-down"
                icon={
                  <img
                    src={state.user.avatarUrl}
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
