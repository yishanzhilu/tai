/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

import * as React from 'react';
import styled from '@emotion/styled';
import { NextStatelessComponent } from 'next';
// import Link from 'next/link';
import { FormItem, Button, InputGroup } from '@iron-branch/core';

import LandingLayout from '@/components/LandingLayout/LandingLayout.tsx';

// interface Props {}

const LoginContainer = styled.section`
  max-width: 100%;
  width: 960px;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120px;
  padding-left: 30px;
  padding-right: 30px;
`;

const LoginForm = styled.form`
  width: 301px;
`;

const Login: NextStatelessComponent = (): React.ReactElement => {
  return (
    <LandingLayout>
      <LoginContainer>
        <h1>登录</h1>
        <LoginForm>
          <FormItem labelFor="email" label="Email">
            <InputGroup id="email" type="text" />
          </FormItem>
          <Button type="submit" fillContainer>
            继续
          </Button>
        </LoginForm>
      </LoginContainer>
    </LandingLayout>
  );
};

// Login.getInitialProps = async (): Promise<Props> => {
// };

export default Login;
