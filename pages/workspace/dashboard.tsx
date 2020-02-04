/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import * as React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import { IPageProps } from '@/src/model/utils';
import { ITodo, IRecord } from '@/src/model/schemas';
import { withPageGuard } from '@/src/utils/auth';
import { sf, HandleError } from '@/src/api';

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
    const resErr = HandleError(error);
    return {
      todos: [],
      records: [],
      error: resErr,
    };
  }
};

export default withPageGuard(Dashboard);
