/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

import * as React from 'react';
import styled from '@emotion/styled';

import { GRID_SIZE } from '@/components/common/variables.ts';

import { Icon, IconName, Button, ButtonDesign } from '@iron-branch/core';

const Main = styled.main`
  background: #fffefc;
`;

const Logo = styled.img`
  width: 30px;
  height: 30px;
`;

const Header = styled.header`
  background: #fffefc;
  display: flex;
  padding: ${GRID_SIZE}px ${GRID_SIZE * 1.5}px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
`;

const HeaderLeft = styled.div`
  flex: 1 1;
  display: flex;
  align-items: center;
`;

const HeaderRight = styled.div`
  flex: 1 1;
  display: flex;
  justify-content: flex-end;
`;

export interface LandingLayoutProps {
  children: React.ReactElement;
}

export default function LandingLayout({
  children,
}: LandingLayoutProps): React.ReactElement {
  return (
    <Main>
      <Header>
        <HeaderLeft>
          <Logo src="/static/layout/logo.png" alt="logo" />
        </HeaderLeft>
        <HeaderRight>
          <Button design={ButtonDesign.GHOST}>
            <Icon icon={IconName.COG} iconSize={25} />
          </Button>
        </HeaderRight>
      </Header>
      {children}
      <footer>footer</footer>
    </Main>
  );
}
