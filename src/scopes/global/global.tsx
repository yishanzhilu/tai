/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { TaiErrorBoundary } from '@/src/components/errors/errorBoundary';
import TaiError from '@/pages/_error';
import { UserContextPorvider } from './userContext';
import { WorkProfileContextPorvider } from './workProfileContext';
import { TopBarContextPorvider } from './topBarContext';
import { ThemeContextPorvider } from './themeContext';

export const GlobalContextsProvider = ({ children }) => {
  return (
    <ThemeContextPorvider>
      <UserContextPorvider>
        <WorkProfileContextPorvider>
          <TaiErrorBoundary fallback={<TaiError code={500} />}>
            <TopBarContextPorvider>{children}</TopBarContextPorvider>
          </TaiErrorBoundary>
        </WorkProfileContextPorvider>
      </UserContextPorvider>
    </ThemeContextPorvider>
  );
};
