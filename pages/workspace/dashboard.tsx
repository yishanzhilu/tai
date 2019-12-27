/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import * as React from 'react';
import { NextPage } from 'next';
import nextCookie from 'next-cookies';

import { H1 } from '@yishanzhilubp/core';

import { redirect } from '@/src/utils/funcs';
import { ITodo } from '@/src/model/schemas';
import { TaiLayout } from '@/src/layout';

interface IDashboard {
  todos: ITodo[];
}

const Dashboard: NextPage<IDashboard> = () => {
  return (
    <TaiLayout>
      <H1>This will be the dash board, still under construction.</H1>
      <img
        width="1000"
        src="https://cdn.yuque.com/yuque/assets/381297/artboard/1570958497461-4ec99c25-ba52-45c9-864f-e0477159a116.png"
        alt="ui"
      />
    </TaiLayout>
  );
};

Dashboard.getInitialProps = async ctx => {
  const defaultProps = {
    todos: [],
  };
  const { token } = nextCookie(ctx);
  if (!token) {
    redirect('/index', ctx);
    return defaultProps;
  }
  try {
    console.log(token);
    return defaultProps;
  } catch (error) {
    // Implementation or Network error
    redirect('/index', ctx, true);
    return defaultProps;
  }
};

export default Dashboard;
