/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import * as React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Classes, H3 } from '@yishanzhilubp/core';

import { IPageProps } from '@/src/model/utils';
import { ITodo, IRecord } from '@/src/model/schemas';
import { withPageGuard } from '@/src/utils/auth';
import { sf } from '@/src/api';

import { WorkSpace } from '@/src/scopes/workspace';
import { WorkList } from '@/src/scopes/workspace/workList';

interface IProps extends IPageProps {
  todos: ITodo[];
  records: IRecord[];
}

const Dashboard: NextPage<IProps> = ({ todos, records }) => {
  return (
    <WorkSpace>
      <Head>
        <title>📋 看板 · 移山</title>
      </Head>
      <H3>📋 看板</H3>
      <p className={Classes.TEXT_MUTED} style={{ marginBottom: 20 }}>
        所有的事项和记录
      </p>
      <Head>
        <title>看板 · 移山</title>
      </Head>
      <WorkList todos={todos} records={records} />
    </WorkSpace>
  );
};

Dashboard.getInitialProps = async ctx => {
  try {
    const [todos, records] = await Promise.all([
      sf<ITodo[]>('/todos', {}, ctx),
      sf<IRecord[]>('/records', {}, ctx),
    ]);
    return {
      todos,
      records,
    };
  } catch (error) {
    return {
      todos: [],
      records: [],
      error,
    };
  }
};

export default withPageGuard(Dashboard);
