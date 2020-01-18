/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';
import { sleep, redirect } from '@/src/utils/funcs';

const Login: NextPage = (): React.ReactElement => {
  return <div>login</div>;
};

Login.getInitialProps = async ctx => {
  await sleep(1000);
  redirect('/', ctx, false, false);
  return {};
};

export default Login;
